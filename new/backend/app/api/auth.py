from apiflask import APIBlueprint
from flask import jsonify
from flask_jwt_extended import (
    create_access_token, current_user, jwt_required, set_access_cookies, unset_jwt_cookies,
)
from sqlalchemy.exc import IntegrityError

from app.extensions import db, limiter
from app.models import User
from app.schemas.user import SigninSchema, SignupSchema, UpdateProfileSchema

auth_bp = APIBlueprint('auth', __name__, tag='Autentifikasiya')


def _auth_response(message, user, status):
    """Signup/signin uğurlu olduqda cavab body-si `user`-i qaytarır, JWT isə
    body-də DEYİL, httpOnly cookie-də göndərilir (bax: config.py JWT_TOKEN_LOCATION)."""
    response = jsonify({'message': message, 'user': user.to_dict()})
    set_access_cookies(response, create_access_token(identity=user))
    return response, status


@auth_bp.post('/signup')
@auth_bp.input(SignupSchema)
@limiter.limit('10 per minute')
def signup(json_data):
    if User.query.filter_by(email=json_data['email']).first():
        return jsonify({'error': 'Bu e-poçt ünvanı ilə artıq istifadəçi var.'}), 409

    # `password` User modelində sütun deyil (yalnız `password_hash`) - `User(**...)`
    # çağırışına ötürülməzdən əvvəl ayrıca çıxarılır.
    password = json_data.pop('password')
    user = User(**json_data)
    user.set_password(password)

    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Bu e-poçt ünvanı ilə artıq istifadəçi var.'}), 409

    return _auth_response('İstifadəçi uğurla qeydiyyatdan keçdi', user, 201)


@auth_bp.post('/signin')
@auth_bp.input(SigninSchema)
@limiter.limit('10 per minute')
def signin(json_data):
    user = User.query.filter_by(email=json_data['email']).first()
    if not user or not user.check_password(json_data['password']):
        return jsonify({'error': 'Yanlış e-poçt və ya şifrə.'}), 401
    return _auth_response('Giriş uğurludur', user, 200)


@auth_bp.post('/logout')
def logout():
    response = jsonify({'message': 'Çıxış edildi'})
    unset_jwt_cookies(response)
    return response, 200


@auth_bp.get('/me')
@jwt_required()
def get_current_user():
    return jsonify({'user': current_user.to_dict()}), 200


@auth_bp.put('/me')
@auth_bp.input(UpdateProfileSchema)
@jwt_required()
def update_current_user(json_data):
    for field, value in json_data.items():
        setattr(current_user, field, value)
    db.session.commit()
    return jsonify({'message': 'Profil uğurla yeniləndi', 'user': current_user.to_dict()}), 200


@auth_bp.delete('/me')
@jwt_required()
def delete_current_user():
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({'message': 'Hesab uğurla silindi'}), 200
