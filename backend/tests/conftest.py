import pytest

from app import create_app
from app.config import Config


@pytest.fixture
def app(tmp_path):
    db_file = tmp_path / "test.db"

    class TestConfig(Config):
        TESTING = True
        DATABASE_PATH = str(db_file)
        SECRET_KEY = "test-secret-key-at-least-32-bytes-long"
        SECRET_KEY_IS_FALLBACK = False
        CORS_ORIGINS = "*"

    application = create_app(TestConfig)
    yield application


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def donor_auth(client):
    """Seed datasındakı hazır donor (leyla@example.com) ilə login olub token qaytarır."""
    res = client.post('/api/signin', json={'email': 'leyla@example.com', 'password': 'password123'})
    data = res.get_json()
    token = data['token']
    return {'token': token, 'user': data['user'], 'headers': {'Authorization': f'Bearer {token}'}}


@pytest.fixture
def second_donor_auth(client):
    """Sahiblik/icazə testləri üçün ikinci bir donor (elvin@example.com)."""
    res = client.post('/api/signin', json={'email': 'elvin@example.com', 'password': 'password123'})
    data = res.get_json()
    token = data['token']
    return {'token': token, 'user': data['user'], 'headers': {'Authorization': f'Bearer {token}'}}
