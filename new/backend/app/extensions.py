"""Tək yerdə saxlanılan extension instansiyaları.

`create_app()` bunları `init_app(app)` ilə konfiqurasiya edir - `app`
modul yüklənən anda deyil, factory çağırılanda bağlanır ki, dövri import
problemi olmasın və testlərdə hər dəfə fərqli config-lə yeni app
yaradıla bilsin.
"""
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
limiter = Limiter(key_func=get_remote_address)
