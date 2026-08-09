import os
import secrets

# Proses başına bir dəfə - .env-də SECRET_KEY yoxdursa, tətbiq heç olmasa
# özü ilə tutarlı qalsın deyə təsadüfi bir açar yaradırıq (server yenidən
# başlayanda əvvəlki JWT-lər etibarsız olacaq). Production-da .env-də
# mütləq SECRET_KEY təyin edin.
_DEV_FALLBACK_SECRET = secrets.token_hex(32)


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or _DEV_FALLBACK_SECRET
    SECRET_KEY_IS_FALLBACK = not os.getenv('SECRET_KEY')

    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    PORT = int(os.getenv('PORT', 5000))

    # Neon (və ya hər hansı Postgres) bağlantı sətri - SQLite artıq
    # dəstəklənmir. Yerli inkişafda bu maşında Docker olmadığı üçün
    # verilənlər bazası bulud (Neon) üzərindədir.
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_pre_ping': True}
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    _origins_raw = os.getenv('CORS_ORIGINS', '*')
    CORS_ORIGINS = [o.strip() for o in _origins_raw.split(',')] if _origins_raw != '*' else '*'

    # --- JWT (cookie-based) ---
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE', 'False').lower() in ('true', '1', 't')
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = True
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 24 * int(os.getenv('JWT_EXPIRY_DAYS', 7))


class TestConfig(Config):
    TESTING = True
    # Testlər eyni verilənlər bazasına qoşulur, amma hər test öz
    # SAVEPOINT-i içində işləyib rollback olunur (bax: tests/conftest.py) -
    # ona görə DB-də iz qalmır, ayrıca test bazasına ehtiyac yoxdur.
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URL') or os.getenv('DATABASE_URL')
    SECRET_KEY = 'test-secret-key-at-least-32-bytes-long'
    SECRET_KEY_IS_FALLBACK = False
    CORS_ORIGINS = '*'
    JWT_COOKIE_CSRF_PROTECT = False
