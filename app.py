import os
import datetime
import functools
from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
import jwt
from dotenv import load_dotenv

import database

load_dotenv()

app = Flask(__name__)

# Konfiqurasiya
SECRET_KEY = os.getenv('SECRET_KEY', 'donor-super-secret-key-change-in-production')
app.config['SECRET_KEY'] = SECRET_KEY

# CORS Ayarları (Frontend sorğuları üçün)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Swagger (Flasgger) Ayarları
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda model: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

template = {
    "swagger": "2.0",
    "info": {
        "title": "Qan Donoru Platforması API",
        "description": "Donor və resipiyentlər üçün RESTful API sənədləşməsi",
        "version": "1.0.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Authorization header. Nümunə: \"Authorization: Bearer {token}\""
        }
    }
}

swagger = Swagger(app, config=swagger_config, template=template)

# Verilənlər bazasını başladırıq
with app.app_context():
    database.init_db()

# --- JWT Token Yoxlama Middleware ---
def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            parts = auth_header.split(' ')
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
            else:
                token = auth_header

        if not token:
            return jsonify({'error': 'Token daxil edilməyib!'}), 401

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = database.get_user_by_id(payload['user_id'])
            if not current_user:
                return jsonify({'error': 'Yanlış və ya vaxtı bitmiş token!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Tokenin vaxtı bitib!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Yanlış token!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# --- Xətaların İdarə Olunması ---
@app.errorhandler(400)
def bad_request_error(e):
    return jsonify({'error': 'Xətalı sorğu. Göndərilən JSON formatını yoxlayın.'}), 400

@app.errorhandler(404)
def not_found_error(e):
    return jsonify({'error': 'Axtarılan endpoint tapılmadı.'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Daxili server xətası baş verdi.'}), 500

# --- API ENDPOINT-LƏRİ ---

@app.route('/api/signup', methods=['POST'])
def signup():
    """
    İstifadəçi Qeydiyyatı (Signup)
    ---
    tags:
      - Autentifikasiya
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: donor@example.com
            password:
              type: string
              example: secret123
            full_name:
              type: string
              example: Ali Əliyev
            blood_type:
              type: string
              example: A+
            city:
              type: string
              example: Bakı
            phone:
              type: string
              example: "+994501234567"
            role:
              type: string
              enum: [donor, recipient]
              example: donor
    responses:
      201:
        description: İstifadəçi uğurla yaradıldı
      400:
        description: Əskik və ya xətalı məlumat
      409:
        description: Bu e-poçt artıq qeydiyyatdan keçib
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({'error': 'Sorğu gövdəsi düzgün JSON obyekti olmalıdır.'}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    full_name = data.get('full_name', '').strip() if data.get('full_name') else None
    blood_type = data.get('blood_type', '').strip() if data.get('blood_type') else None
    city = data.get('city', '').strip() if data.get('city') else None
    phone = data.get('phone', '').strip() if data.get('phone') else None
    role = data.get('role', 'donor').strip()

    if not email or not password:
        return jsonify({'error': '"email" və "password" xanaları mütləqdir.'}), 400

    if len(password) < 4:
        return jsonify({'error': 'Şifrə ən azı 4 simvol olmalıdır.'}), 400

    existing_user = database.get_user_by_email(email)
    if existing_user:
        return jsonify({'error': 'Bu e-poçt ünvanı ilə artıq istifadəçi var.'}), 409

    user = database.create_user(
        email=email,
        password=password,
        full_name=full_name,
        blood_type=blood_type,
        city=city,
        phone=phone,
        role=role
    )

    if not user:
        return jsonify({'error': 'İstifadəçi yaradılarkən xəta baş verdi.'}), 500

    user.pop('password_hash', None)
    return jsonify({
        'message': 'İstifadəçi uğurla qeydiyyatdan keçdi',
        'user': user
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    """
    İstifadəçi Girişi (Login)
    ---
    tags:
      - Autentifikasiya
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: donor@example.com
            password:
              type: string
              example: secret123
    responses:
      200:
        description: Giriş uğurludur, JWT token qaytarılır
      400:
        description: E-poçt və ya şifrə əskikdir
      401:
        description: Yanlış e-poçt və ya şifrə
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({'error': 'Sorğu gövdəsi düzgün JSON obyekti olmalıdır.'}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'error': '"email" və "password" xanaları mütləqdir.'}), 400

    user = database.get_user_by_email(email)
    if not user or not database.verify_password(user['password_hash'], password):
        return jsonify({'error': 'Yanlış e-poçt və ya şifrə.'}), 401

    token_payload = {
        'user_id': user['id'],
        'email': user['email'],
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }
    token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')

    user.pop('password_hash', None)
    return jsonify({
        'message': 'Giriş uğurludur',
        'token': token,
        'user': user
    }), 200


@app.route('/api/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """
    Daxil olmuş istifadəçi profili
    ---
    tags:
      - İstifadəçi Profili
    security:
      - Bearer: []
    responses:
      200:
        description: İstifadəçi məlumatları
      401:
        description: Token əskikdir və ya keçərsizdir
    """
    current_user.pop('password_hash', None)
    return jsonify({'user': current_user}), 200


@app.route('/api/donors', methods=['GET'])
def get_donors():
    """
    Qan Donorlarının Siyahısı (Axtarış və Filtrasiya ilə)
    ---
    tags:
      - Donor Axtarışı
    parameters:
      - in: query
        name: blood_type
        type: string
        description: Qan qrupuna görə süzgəc (nümunə A+, B-, O+)
      - in: query
        name: city
        type: string
        description: Şəhərə görə süzgəc (nümunə Bakı, Gəncə)
    responses:
      200:
        description: Donorların siyahısı
    """
    blood_type = request.args.get('blood_type')
    city = request.args.get('city')
    donors = database.get_all_donors(blood_type=blood_type, city=city)
    return jsonify({'donors': donors, 'count': len(donors)}), 200


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    port = int(os.getenv('PORT', 5000))
    print(f"Donor API Server başladı: http://127.0.0.1:{port} (debug={debug_mode})")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
