from apiflask import APIBlueprint
from flask import jsonify
from flask_jwt_extended import current_user, jwt_required

from app.extensions import db
from app.models import BloodRequest
from app.schemas.blood_request import CreateRequestSchema, RequestQuerySchema, UpdateRequestSchema

requests_bp = APIBlueprint('requests', __name__, tag='Təcili Qan Ehtiyacları')


@requests_bp.get('/requests')
@requests_bp.input(RequestQuerySchema, location='query')
@jwt_required(optional=True)
def get_requests(query_data):
    query = BloodRequest.query
    if query_data['status'] and query_data['status'] != 'all':
        query = query.filter_by(status=query_data['status'])
    if query_data['blood_type']:
        query = query.filter_by(blood_type=query_data['blood_type'])
    if query_data['city']:
        query = query.filter_by(city=query_data['city'])
    if query_data['urgency']:
        query = query.filter_by(urgency=query_data['urgency'])
    if query_data['user_id']:
        query = query.filter_by(user_id=query_data['user_id'])

    items = query.order_by(BloodRequest.created_at.desc()).all()
    include_phone = bool(current_user)
    payload = [item.to_dict(include_phone=include_phone) for item in items]
    return jsonify({'requests': payload, 'count': len(payload)}), 200


@requests_bp.get('/requests/<int:request_id>')
@jwt_required(optional=True)
def get_request_detail(request_id):
    item = db.session.get(BloodRequest, request_id)
    if not item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404
    include_phone = bool(current_user)
    return jsonify({'request': item.to_dict(include_phone=include_phone)}), 200


@requests_bp.post('/requests')
@requests_bp.input(CreateRequestSchema)
@jwt_required()
def create_request(json_data):
    item = BloodRequest(user_id=current_user.id, **json_data)
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Qan ehtiyacı elanı uğurla yaradıldı', 'request': item.to_dict()}), 201


@requests_bp.put('/requests/<int:request_id>')
@requests_bp.input(UpdateRequestSchema)
@jwt_required()
def update_request(request_id, json_data):
    item = db.session.get(BloodRequest, request_id)
    if not item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404
    if item.user_id != current_user.id:
        return jsonify({'error': 'Bu elanı dəyişməyə icazəniz yoxdur.'}), 403

    for field, value in json_data.items():
        setattr(item, field, value)
    db.session.commit()
    return jsonify({'message': 'Elan uğurla yeniləndi', 'request': item.to_dict()}), 200


@requests_bp.delete('/requests/<int:request_id>')
@jwt_required()
def delete_request(request_id):
    item = db.session.get(BloodRequest, request_id)
    if not item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404
    if item.user_id != current_user.id:
        return jsonify({'error': 'Bu elanı silməyə icazəniz yoxdur.'}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Qan ehtiyacı elanı uğurla silindi'}), 200
