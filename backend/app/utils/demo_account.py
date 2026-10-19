import os

from sqlalchemy.exc import SQLAlchemyError

from app.extensions import db
from app.models import User


def ensure_demo_account():
    if os.getenv('DEMO_ACCOUNT_ENABLED', 'True').lower() not in ('true', '1', 'yes'):
        return

    email = os.getenv('DEMO_EMAIL', 'demo@donor.az')
    password = os.getenv('DEMO_PASSWORD', 'DonorDemo2026!')

    try:
        user = User.query.filter_by(email=email).first()
        if user is None:
            user = User(
                email=email,
                full_name='Donor.az Demo',
                blood_type='O+',
                city='Bakı',
                phone='+994501234567',
                bio='Demo hesabı',
            )
            db.session.add(user)

        user.set_password(password)
        user.is_available = True
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
