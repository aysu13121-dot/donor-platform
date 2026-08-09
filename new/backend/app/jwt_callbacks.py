"""Flask-JWT-Extended callback-ləri - köhnə backend-dəki əl ilə yazılmış
`token_required`/`optional_token` dekoratorlarının yerini tutur. Bir dəfə
burada qeydiyyatdan keçdikdən sonra istənilən route-da sadəcə
`@jwt_required()` / `@jwt_required(optional=True)` + qlobal `current_user`
proxy-si kifayətdir."""
from flask import jsonify

from app.extensions import db, jwt
from app.models import User


def register_jwt_callbacks():
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user.id)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        return db.session.get(User, int(jwt_data['sub']))

    @jwt.user_lookup_error_loader
    def handle_user_lookup_error(_jwt_header, _jwt_data):
        # Token etibarlıdır, amma arxasındakı istifadəçi artıq yoxdur (məs.
        # hesab silinib) - eyni "token daxil edilməyib" mesajı ilə 401.
        return jsonify({'error': 'Token daxil edilməyib!'}), 401

    @jwt.unauthorized_loader
    def handle_missing_token(_reason):
        return jsonify({'error': 'Token daxil edilməyib!'}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(_reason):
        return jsonify({'error': 'Yanlış token!'}), 401

    @jwt.expired_token_loader
    def handle_expired_token(_jwt_header, _jwt_data):
        return jsonify({'error': 'Tokenin vaxtı bitib!'}), 401

    @jwt.needs_fresh_token_loader
    def handle_needs_fresh_token(_jwt_header, _jwt_data):
        return jsonify({'error': 'Token yenilənməlidir!'}), 401
