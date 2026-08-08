import functools

import jwt
from flask import current_app, jsonify, request

from app.models import db


def token_required(f):
    """Bearer JWT tələb edən endpoint-lər üçün dekorator.

    Etibarlıdırsa, əldə edilən istifadəçi sətri (`current_user`) dict olaraq
    dekorasiya olunan funksiyaya ilk arqument kimi ötürülür.
    """
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
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = db.get_user_by_id(payload['user_id'])
            if not current_user:
                return jsonify({'error': 'Yanlış və ya vaxtı bitmiş token!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Tokenin vaxtı bitib!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Yanlış token!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated
