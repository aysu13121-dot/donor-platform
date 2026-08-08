import os
import secrets

# Proses başına bir dəfə - .env-də SECRET_KEY yoxdursa, tətbiq heç olmasa
# özü ilə tutarlı qalsın deyə təsadüfi bir açar yaradırıq (server yenidən başlayanda
# əvvəlki JWT-lər etibarsız olacaq). Production-da .env-də mütləq SECRET_KEY təyin edin.
_DEV_FALLBACK_SECRET = secrets.token_hex(32)


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or _DEV_FALLBACK_SECRET
    SECRET_KEY_IS_FALLBACK = not os.getenv('SECRET_KEY')

    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    PORT = int(os.getenv('PORT', 5000))

    DATABASE_PATH = os.getenv(
        'DATABASE_PATH',
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database.db')
    )

    _origins_raw = os.getenv('CORS_ORIGINS', '*')
    CORS_ORIGINS = [o.strip() for o in _origins_raw.split(',')] if _origins_raw != '*' else '*'

    JWT_EXPIRY_DAYS = int(os.getenv('JWT_EXPIRY_DAYS', 7))


class TestConfig(Config):
    TESTING = True
