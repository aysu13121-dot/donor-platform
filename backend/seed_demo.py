"""Create or refresh the stable demo account in the configured database."""
import os

from dotenv import load_dotenv

load_dotenv()

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import User  # noqa: E402


DEMO_EMAIL = os.getenv('DEMO_EMAIL', 'demo@donor.az')
DEMO_PASSWORD = os.getenv('DEMO_PASSWORD', 'DonorDemo2026!')


def main():
    app = create_app()
    with app.app_context():
        user = User.query.filter_by(email=DEMO_EMAIL).first()
        if user is None:
            user = User(
                email=DEMO_EMAIL,
                full_name='Donor.az Demo',
                blood_type='O+',
                city='Bakı',
                phone='+994501234567',
                bio='Demo hesabı',
            )
            db.session.add(user)

        user.set_password(DEMO_PASSWORD)
        user.is_available = True
        db.session.commit()
        print(f'Demo account ready: {DEMO_EMAIL}')


if __name__ == '__main__':
    main()