import sys

from flasgger import Swagger
from flask import Flask, jsonify
from flask_cors import CORS

from app.config import Config
from app.models import db

SWAGGER_CONFIG = {
    "headers": [],
    "specs": [{
        "endpoint": 'apispec_1',
        "route": '/apispec_1.json',
        "rule_filter": lambda rule: True,
        "model_filter": lambda model: True,
    }],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/",
}

SWAGGER_TEMPLATE = {
    "swagger": "2.0",
    "info": {
        "title": "Donor.az API",
        "description": "Donor və resipiyentlər üçün RESTful API sənədləşməsi",
        "version": "3.0.0",
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": 'JWT Authorization header. Nümunə: "Authorization: Bearer {token}"',
        }
    },
}


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.json.ensure_ascii = False

    if getattr(config_class, 'SECRET_KEY_IS_FALLBACK', False) and not app.config.get('TESTING'):
        print(
            "UYARI: SECRET_KEY .env-də təyin olunmayıb - müvəqqəti, təsadüfi bir açar "
            "istifadə olunur. Server yenidən başladıqda bütün JWT-lər etibarsız olacaq. "
            "Production-da mütləq SECRET_KEY təyin edin (.env.example-a baxın).",
            file=sys.stderr,
        )

    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    if not app.config.get('TESTING'):
        Swagger(app, config=SWAGGER_CONFIG, template=SWAGGER_TEMPLATE)

    db.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.donors import donors_bp
    from app.routes.offers import offers_bp
    from app.routes.requests import requests_bp
    from app.routes.stats import stats_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(donors_bp, url_prefix='/api')
    app.register_blueprint(requests_bp, url_prefix='/api')
    app.register_blueprint(offers_bp, url_prefix='/api')
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
