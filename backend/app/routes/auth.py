import datetime
import re

import jwt
from flask import Blueprint, current_app, jsonify, request

from app.models import db
from app.utils.auth import token_required

auth_bp = Blueprint('auth', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
# Azərbaycan mobil nömrəsi: +994XXXXXXXXX və ya 0XXXXXXXXX (boşluq/tire
# çıxarıldıqdan sonra) - frontend-dəki eyni qaydanın (lib/utils.js isValidPhone)
# backend qarşılığıdır.
PHONE_RE = re.compile(r'^(\+994|0)\d{9}$')


def _is_valid_phone(phone):
    return bool(PHONE_RE.match(re.sub(r'[\s-]', '', phone)))


def _issue_token(user):
    payload = {
        'user_id': user['id'],
        'email': user['email'],
        'exp': datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(days=current_app.config['JWT_EXPIRY_DAYS']),
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


@auth_bp.route('/signup', methods=['POST'])
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
          required: [email, password, phone]
          properties:
            email: {type: string, example: donor@example.com}
            password: {type: string, example: secret123}
            full_name: {type: string, example: Ali Əliyev}
            blood_type: {type: string, example: A+}
            city: {type: string, example: Bakı}
            phone: {type: string, example: "+994501234567"}
            role: {type: string, enum: [donor, recipient], example: donor}
            bio: {type: string, example: Qan verməyə hazıram}
    responses:
      201: {description: İstifadəçi uğurla yaradıldı}
      400: {description: Əskik və ya xətalı məlumat}
      409: {description: Bu e-poçt artıq qeydiyyatdan keçib}
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

    if not email or not password or not phone:
        return jsonify({'error': '"email", "password" və "phone" xanaları mütləqdir.'}), 400
    if not EMAIL_RE.match(email):
        return jsonify({'error': 'Düzgün email formatı daxil edin.'}), 400
    if len(password) < 4:
        return jsonify({'error': 'Şifrə ən azı 4 simvol olmalıdır.'}), 400
    if not _is_valid_phone(phone):
        return jsonify({'error': 'Düzgün telefon nömrəsi daxil edin (məs: +994501234567).'}), 400

    if db.get_user_by_email(email):
        return jsonify({'error': 'Bu e-poçt ünvanı ilə artıq istifadəçi var.'}), 409

    user = db.create_user(
        email=email, password=password, full_name=full_name, blood_type=blood_type,
        city=city, phone=phone, role=role, bio=bio,
    )
    if not user:
        return jsonify({'error': 'İstifadəçi yaradılarkən xəta baş verdi.'}), 500

    # Qeydiyyatdan dərhal sonra da JWT qaytarırıq ki, istifadəçi ayrıca login
    # etmək məcburiyyətində qalmasın (əvvəlki versiyada signup token
    # qaytarmırdı, amma frontend elə bil qaytarırmış kimi istifadə edirdi).
    token = _issue_token(user)
    user.pop('password_hash', None)
    return jsonify({'message': 'İstifadəçi uğurla qeydiyyatdan keçdi', 'token': token, 'user': user}), 201


@auth_bp.route('/login', methods=['POST'])
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
          required: [email, password]
          properties:
            email: {type: string, example: donor@example.com}
            password: {type: string, example: secret123}
    responses:
      200: {description: Giriş uğurludur, JWT token qaytarılır}
      400: {description: E-poçt və ya şifrə əskikdir}
      401: {description: Yanlış e-poçt və ya şifrə}
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({'error': 'Sorğu gövdəsi düzgün JSON obyekti olmalıdır.'}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    if not email or not password:
        return jsonify({'error': '"email" və "password" xanaları mütləqdir.'}), 400

    user = db.get_user_by_email(email)
    if not user or not db.verify_password(user['password_hash'], password):
        return jsonify({'error': 'Yanlış e-poçt və ya şifrə.'}), 401

    token = _issue_token(user)
    user.pop('password_hash', None)
    return jsonify({'message': 'Giriş uğurludur', 'token': token, 'user': user}), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """
    Daxil olmuş istifadəçi profili
    ---
    tags: [İstifadəçi Profili]
    security: [{Bearer: []}]
    responses:
      200: {description: İstifadəçi məlumatları}
      401: {description: Token əskikdir və ya keçərsizdir}
    """
    current_user.pop('password_hash', None)
    return jsonify({'user': current_user}), 200


@auth_bp.route('/me', methods=['PUT'])
@token_required
def update_current_user(current_user):
    """
    İstifadəçi profilini və donorluq statusunu yeniləmək
    ---
    tags: [İstifadəçi Profili]
    security: [{Bearer: []}]
    parameters:
      - in: body
        name: body
        schema:
          type: object
          properties:
            full_name: {type: string}
            blood_type: {type: string}
            city: {type: string}
            phone: {type: string}
            is_available: {type: integer, enum: [0, 1]}
            last_donation_date: {type: string}
            bio: {type: string}
    responses:
      200: {description: Profil uğurla yeniləndi}
      404: {description: İstifadəçi tapılmadı}
    """
    data = request.get_json(silent=True) or {}
    if data.get('phone') and not _is_valid_phone(data['phone']):
        return jsonify({'error': 'Düzgün telefon nömrəsi daxil edin (məs: +994501234567).'}), 400

    updated = db.update_user_profile(
        user_id=current_user['id'],
        full_name=data.get('full_name'),
        blood_type=data.get('blood_type'),
        city=data.get('city'),
        phone=data.get('phone'),
        is_available=data.get('is_available'),
        last_donation_date=data.get('last_donation_date'),
        bio=data.get('bio'),
    )
    if not updated:
        return jsonify({'error': 'İstifadəçi tapılmadı və ya yenilənmə alınmadı.'}), 404

    updated.pop('password_hash', None)
    return jsonify({'message': 'Profil uğurla yeniləndi', 'user': updated}), 200


@auth_bp.route('/me', methods=['DELETE'])
@token_required
def delete_current_user(current_user):
    """
    Hesabı silmək
    ---
    tags: [İstifadəçi Profili]
    security: [{Bearer: []}]
    responses:
      200: {description: Hesab uğurla silindi}
      404: {description: İstifadəçi tapılmadı}
    """
    if not db.delete_user(current_user['id']):
        return jsonify({'error': 'İstifadəçi tapılmadı.'}), 404
    return jsonify({'message': 'Hesab uğurla silindi'}), 200
