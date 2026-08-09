import sys

from apiflask import APIFlask
from flask import jsonify

from app.config import Config
from app.extensions import cors, db, jwt, limiter, migrate

API_TITLE = 'Donor.az API'
API_VERSION = '1.0.0'


def create_app(config_class=Config):
    app = APIFlask(__name__, title=API_TITLE, version=API_VERSION)
    app.config.from_object(config_class)
    app.json.ensure_ascii = False

    if getattr(config_class, 'SECRET_KEY_IS_FALLBACK', False) and not app.config.get('TESTING'):
        print(
            "UYARI: SECRET_KEY .env-də təyin olunmayıb - müvəqqəti, təsadüfi bir açar "
            "istifadə olunur. Server yenidən başladıqda bütün JWT-lər etibarsız olacaq. "
            "Production-da mütləq SECRET_KEY təyin edin (.env.example-a baxın).",
            file=sys.stderr,
        )
    if not app.config.get('SQLALCHEMY_DATABASE_URI') and not app.config.get('TESTING'):
        print(
            "XƏBƏRDARLIQ: DATABASE_URL təyin olunmayıb - verilənlər bazasına qoşulmaq "
            "mümkün olmayacaq (.env.example-a baxın).",
            file=sys.stderr,
        )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    # Cookie-based auth kredensial (credentials) tələb edir - CORS "*" origin-lə
    # işləmir, ona görə CORS_ORIGINS .env-də açıq siyahı kimi göstərilməlidir.
    cors.init_app(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}}, supports_credentials=True)

    from app.api.auth import auth_bp
    from app.api.donors import donors_bp
    from app.api.requests import requests_bp
    from app.api.stats import stats_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(donors_bp, url_prefix='/api')
    app.register_blueprint(requests_bp, url_prefix='/api')
    app.register_blueprint(stats_bp, url_prefix='/api')

    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok'}), 200

    @app.errorhandler(400)
    def bad_request_error(_e):
        return jsonify({'error': 'Xətalı sorğu. Göndərilən JSON formatını yoxlayın.'}), 400

    @app.errorhandler(404)
    def not_found_error(_e):
        return jsonify({'error': 'Axtarılan endpoint tapılmadı.'}), 404

    @app.errorhandler(500)
    def internal_error(_e):
        return jsonify({'error': 'Daxili server xətası baş verdi.'}), 500

    return app
