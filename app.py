import os
import datetime
import functools
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flasgger import Swagger
import jwt
from dotenv import load_dotenv

import database

load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')

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
        "description": "Donor və resipiyentlər üçün RESTful API sənədləşməsi (Sprint 2 - 50% Completion)",
        "version": "2.0.0"
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

# --- Frontend Veb Tətbiqinin İnteqrasiyası ---
@app.route('/')
def serve_frontend():
    return send_from_directory('static', 'index.html')

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
            bio:
              type: string
              example: Qan verməyə hazıram
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
    bio = data.get('bio', '').strip() if data.get('bio') else None

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
        role=role,
        bio=bio
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


# ==============================================================================
# 🚀 SPRINT 2 ƏLAVƏ EDİLƏN YENİ ENDPOINT-LƏR (YENİLƏNMİŞ HİSSƏ)
# ==============================================================================

@app.route('/api/me', methods=['PUT'])
@token_required
def update_profile(current_user):
    """
    İstifadəçi profilini və Donorluq statusunu yeniləmək
    ---
    tags:
      - İstifadəçi Profili
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            full_name:
              type: string
            blood_type:
              type: string
            city:
              type: string
            phone:
              type: string
            is_available:
              type: integer
              enum: [0, 1]
            last_donation_date:
              type: string
            bio:
              type: string
    responses:
      200:
        description: Profil uğurla yeniləndi
    """
    data = request.get_json(silent=True) or {}
    updated = database.update_user_profile(
        user_id=current_user['id'],
        full_name=data.get('full_name'),
        blood_type=data.get('blood_type'),
        city=data.get('city'),
        phone=data.get('phone'),
        is_available=data.get('is_available'),
        last_donation_date=data.get('last_donation_date'),
        bio=data.get('bio')
    )
    if not updated:
        return jsonify({'error': 'İstifadəçi tapılmadı və ya yenilənmə alınmadı.'}), 404

    updated.pop('password_hash', None)
    return jsonify({'message': 'Profil uğurla yeniləndi', 'user': updated}), 200


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
      - in: query
        name: is_available
        type: integer
        description: Donorluq statusuna görə süzgəc (1 = aktiv, 0 = deaktiv)
    responses:
      200:
        description: Donorların siyahısı
    """
    blood_type = request.args.get('blood_type')
    city = request.args.get('city')
    is_avail_raw = request.args.get('is_available')
    is_avail = int(is_avail_raw) if is_avail_raw in ('0', '1') else None

    donors = database.get_all_donors(blood_type=blood_type, city=city, is_available=is_avail)
    return jsonify({'donors': donors, 'count': len(donors)}), 200


@app.route('/api/donors/<int:donor_id>', methods=['GET'])
def get_donor_detail(donor_id):
    """
    Tək bir Donorun Ətraflı Profili
    ---
    tags:
      - Donor Axtarışı
    parameters:
      - in: path
        name: donor_id
        required: true
        type: integer
    responses:
      200:
        description: Donor məlumatları
      404:
        description: Donor tapılmadı
    """
    donor = database.get_user_by_id(donor_id)
    if not donor or donor.get('role') != 'donor':
        return jsonify({'error': 'Donor tapılmadı.'}), 404
    donor.pop('password_hash', None)
    return jsonify({'donor': donor}), 200


# --- QAN EHTİYACLARI / TƏCİLİ ELANLAR (BLOOD REQUESTS CRUD) ---

@app.route('/api/requests', methods=['GET'])
def get_requests():
    """
    Qan Ehtiyacı Elanlarının Siyahısı (Filtrasiya İlə)
    ---
    tags:
      - Təcili Qan Ehtiyacları
    parameters:
      - in: query
        name: blood_type
        type: string
      - in: query
        name: city
        type: string
      - in: query
        name: urgency
        type: string
        enum: [Urgent, Normal]
      - in: query
        name: status
        type: string
        enum: [active, fulfilled, cancelled, all]
      - in: query
        name: user_id
        type: integer
    responses:
      200:
        description: Elanların siyahısı
    """
    blood_type = request.args.get('blood_type')
    city = request.args.get('city')
    urgency = request.args.get('urgency')
    status = request.args.get('status', 'active')
    user_id = request.args.get('user_id')

    if status == 'all':
        status = None

    requests_list = database.get_blood_requests(
        blood_type=blood_type,
        city=city,
        urgency=urgency,
        status=status,
        user_id=int(user_id) if user_id else None
    )
    return jsonify({'requests': requests_list, 'count': len(requests_list)}), 200


@app.route('/api/requests/<int:request_id>', methods=['GET'])
def get_request_detail(request_id):
    """
    Qan Ehtiyacı Elanının Detalları
    ---
    tags:
      - Təcili Qan Ehtiyacları
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
    responses:
      200:
        description: Elan detalları
      404:
        description: Elan tapılmadı
    """
    req_item = database.get_blood_request_by_id(request_id)
    if not req_item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404
    return jsonify({'request': req_item}), 200


@app.route('/api/requests', methods=['POST'])
@token_required
def create_request(current_user):
    """
    Yeni Təcili Qan Ehtiyacı Elanı Yaratmaq
    ---
    tags:
      - Təcili Qan Ehtiyacları
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - patient_name
            - blood_type
            - hospital
            - city
            - contact_phone
          properties:
            patient_name:
              type: string
              example: Məmmədov Əli
            blood_type:
              type: string
              example: A+
            hospital:
              type: string
              example: Mərkəzi Qan Bankı
            city:
              type: string
              example: Bakı
            units_needed:
              type: integer
              example: 2
            urgency:
              type: string
              enum: [Urgent, Normal]
              example: Urgent
            contact_phone:
              type: string
              example: "+994501234567"
            note:
              type: string
              example: Təcili əməliyyat üçündür
    responses:
      201:
        description: Elan uğurla dərci edildi
      400:
        description: Əskik məlumatlar var
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({'error': 'Sorğu gövdəsi düzgün JSON obyekti olmalıdır.'}), 400

    patient_name = data.get('patient_name', '').strip()
    blood_type = data.get('blood_type', '').strip()
    hospital = data.get('hospital', '').strip()
    city = data.get('city', '').strip()
    contact_phone = data.get('contact_phone', '').strip()
    units_needed = data.get('units_needed', 1)
    urgency = data.get('urgency', 'Urgent').strip()
    note = data.get('note', '').strip() if data.get('note') else None

    if not patient_name or not blood_type or not hospital or not city or not contact_phone:
        return jsonify({'error': 'patient_name, blood_type, hospital, city və contact_phone xanaları mütləqdir.'}), 400

    new_req = database.create_blood_request(
        user_id=current_user['id'],
        patient_name=patient_name,
        blood_type=blood_type,
        hospital=hospital,
        city=city,
        units_needed=int(units_needed),
        urgency=urgency,
        contact_phone=contact_phone,
        note=note
    )

    return jsonify({'message': 'Qan ehtiyacı elanı uğurla yaradıldı', 'request': new_req}), 201


@app.route('/api/requests/<int:request_id>', methods=['PUT'])
@token_required
def update_request(current_user, request_id):
    """
    Elanı Yeniləmək və ya Statusunu "fulfilled" (Tamamlandı) etmək
    ---
    tags:
      - Təcili Qan Ehtiyacları
    security:
      - Bearer: []
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
      - in: body
        name: body
        schema:
          type: object
          properties:
            status:
              type: string
              enum: [active, fulfilled, cancelled]
    responses:
      200:
        description: Elan yeniləndi
      403:
        description: Bu elanı dəyişməyə icazəniz yoxdur
    """
    data = request.get_json(silent=True) or {}
    updated = database.update_blood_request(
        request_id=request_id,
        user_id=current_user['id'],
        patient_name=data.get('patient_name'),
        blood_type=data.get('blood_type'),
        hospital=data.get('hospital'),
        city=data.get('city'),
        units_needed=data.get('units_needed'),
        urgency=data.get('urgency'),
        contact_phone=data.get('contact_phone'),
        note=data.get('note'),
        status=data.get('status')
    )

    if not updated:
        return jsonify({'error': 'Elan tapılmadı və ya onu redaktə etməyə səlahiyyətiniz çatmır.'}), 403

    return jsonify({'message': 'Elan uğurla yeniləndi', 'request': updated}), 200


@app.route('/api/requests/<int:request_id>', methods=['DELETE'])
@token_required
def delete_request(current_user, request_id):
    """
    Qan Ehtiyacı Elanını Silmək
    ---
    tags:
      - Təcili Qan Ehtiyacları
    security:
      - Bearer: []
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
    responses:
      200:
        description: Elan silindi
      403:
        description: Səlahiyyət çatışmır
    """
    success = database.delete_blood_request(request_id=request_id, user_id=current_user['id'])
    if not success:
        return jsonify({'error': 'Elan tapılmadı və ya silməyə səlahiyyətiniz yoxdur.'}), 403
    return jsonify({'message': 'Qan ehtiyacı elanı uğurla silindi'}), 200


# --- DONOR MÜRACİƏTLƏRİ VƏ TƏKLİFLƏRİ ---

@app.route('/api/requests/<int:request_id>/respond', methods=['POST'])
@token_required
def respond_to_request(current_user, request_id):
    """
    Donor olaraq elana kömək təklifi göndərmək
    ---
    tags:
      - Donor Müraciətləri
    security:
      - Bearer: []
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
      - in: body
        name: body
        schema:
          type: object
          properties:
            message:
              type: string
              example: Mən bu gün xəstəxanaya gələ bilərəm.
    responses:
      201:
        description: Təklif göndərildi
    """
    req_item = database.get_blood_request_by_id(request_id)
    if not req_item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404

    data = request.get_json(silent=True) or {}
    message = data.get('message', '').strip() if data.get('message') else None

    offer_id = database.create_donation_offer(
        request_id=request_id,
        donor_id=current_user['id'],
        message=message
    )

    return jsonify({'message': 'Donorluq təklifiniz dərhal elan sahibinə çatdırıldı!', 'offer_id': offer_id}), 201


@app.route('/api/requests/<int:request_id>/responses', methods=['GET'])
@token_required
def get_request_responses(current_user, request_id):
    """
    Elan sahibinin öz elanına gələn donor təkliflərini görməsi
    ---
    tags:
      - Donor Müraciətləri
    security:
      - Bearer: []
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
    responses:
      200:
        description: Donor təkliflərinin siyahısı
    """
    req_item = database.get_blood_request_by_id(request_id)
    if not req_item or req_item['user_id'] != current_user['id']:
        return jsonify({'error': 'Elan tapılmadı və ya baxmağa icazəniz yoxdur.'}), 403

    offers = database.get_offers_for_request(request_id)
    return jsonify({'offers': offers, 'count': len(offers)}), 200


# --- CANLI PLATFORMA STATİSTİKASI ---

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Platformanın Canlı Statistika Göstəriciləri
    ---
    tags:
      - Platforma Statistikası
    responses:
      200:
        description: Statistika məlumatları
    """
    stats = database.get_platform_stats()
    return jsonify({'stats': stats}), 200


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    port = int(os.getenv('PORT', 5000))
    print(f"Donor API Server başladı: http://127.0.0.1:{port} (debug={debug_mode})")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
