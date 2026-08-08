from flask import Blueprint, jsonify, request

from app.models import db
from app.utils.auth import token_required

offers_bp = Blueprint('offers', __name__)


@offers_bp.route('/requests/<int:request_id>/respond', methods=['POST'])
@token_required
def respond_to_request(current_user, request_id):
    """
    Donor olaraq elana kömək təklifi göndərmək
    ---
    tags:
      - Donor Müraciətləri
    security: [{Bearer: []}]
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
            message: {type: string, example: Mən bu gün xəstəxanaya gələ bilərəm.}
    responses:
      201: {description: Təklif göndərildi}
      404: {description: Elan tapılmadı}
    """
    req_item = db.get_blood_request_by_id(request_id)
    if not req_item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404

    data = request.get_json(silent=True) or {}
    message = data.get('message', '').strip() if data.get('message') else None

    offer_id = db.create_donation_offer(request_id=request_id, donor_id=current_user['id'], message=message)
    return jsonify({'message': 'Donorluq təklifiniz dərhal elan sahibinə çatdırıldı!', 'offer_id': offer_id}), 201


@offers_bp.route('/requests/<int:request_id>/responses', methods=['GET'])
@token_required
def get_request_responses(current_user, request_id):
    """
    Elan sahibinin öz elanına gələn donor təkliflərini görməsi
    ---
    tags:
      - Donor Müraciətləri
    security: [{Bearer: []}]
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
    responses:
      200: {description: Donor təkliflərinin siyahısı}
      403: {description: Baxmağa icazəniz yoxdur}
    """
    req_item = db.get_blood_request_by_id(request_id)
    if not req_item or req_item['user_id'] != current_user['id']:
        return jsonify({'error': 'Elan tapılmadı və ya baxmağa icazəniz yoxdur.'}), 403

    offers = db.get_offers_for_request(request_id)
    return jsonify({'offers': offers, 'count': len(offers)}), 200
