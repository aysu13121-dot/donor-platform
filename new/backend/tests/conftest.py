"""Test infrastruktur.

Bu maşında Docker/yerli Postgres olmadığı üçün testlər eyni bulud (Neon)
bazasına qoşulur (bax: TEST_DATABASE_URL/DATABASE_URL, app/config.py).
Seed data artıq yoxdur, ona görə hər fixture lazım olan istifadəçini
`/api/signup` ilə özü yaradır və test bitəndə silir - testlər arasında iz
qalmır, paylaşılan bazaya baxmayaraq.

Auth cookie-based olduğu üçün (bax: JWT_TOKEN_LOCATION=['cookies']) hər
authenticated fixture öz test client-ini yaradır (bir client = bir brauzer
sessiyası) - eyni testdə iki fərqli istifadəçi eyni anda "daxil olmuş"
olsun deyə (sahiblik/icazə testləri üçün), tək client-in cookie jar-ını
paylaşmaq mümkün deyil.
"""
import uuid

import pytest
from dotenv import load_dotenv

load_dotenv()

from app import create_app  # noqa: E402  (load_dotenv() Config oxumadan əvvəl set olmalıdır)
from app.config import TestConfig
from app.extensions import db as _db
from app.models import User


@pytest.fixture(scope='session')
def app():
    return create_app(TestConfig)


@pytest.fixture
def client(app):
    return app.test_client()


def _create_donor(app, **overrides):
    donor_client = app.test_client()
    payload = {
        'email': f"donor-{uuid.uuid4().hex[:10]}@test.example",
        'password': 'password123',
        'full_name': 'Test Donor',
        'blood_type': 'A+',
        'city': 'Bakı',
        'phone': '+994501112233',
    }
    payload.update(overrides)
    res = donor_client.post('/api/signup', json=payload)
    assert res.status_code == 201, res.get_json()
    return donor_client, res.get_json()['user']


def _delete_user(app, user_id):
    with app.app_context():
        user = _db.session.get(User, user_id)
        if user:
            _db.session.delete(user)
            _db.session.commit()


@pytest.fixture
def donor_auth(app):
    donor_client, user = _create_donor(app)
    yield {'client': donor_client, 'user': user}
    _delete_user(app, user['id'])


@pytest.fixture
def second_donor_auth(app):
    donor_client, user = _create_donor(app, blood_type='O+', city='Gəncə')
    yield {'client': donor_client, 'user': user}
    _delete_user(app, user['id'])


@pytest.fixture
def cleanup_emails(app):
    """Testlər özləri `/api/signup` çağıran (donor_auth fixture-ından
    keçməyən) hallarda istifadə üçün - test bitəndə bu siyahıdakı
    e-poçtlara aid istifadəçiləri silir."""
    emails = []
    yield emails
    if not emails:
        return
    with app.app_context():
        User.query.filter(User.email.in_(emails)).delete(synchronize_session=False)
        _db.session.commit()
