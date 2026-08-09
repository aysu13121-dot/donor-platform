from flask import Blueprint, jsonify, request

from app.models import db
from app.utils.auth import optional_token, token_required
from app.utils.validators import is_valid_phone

requests_bp = Blueprint('requests', __name__)


@requests_bp.route('/requests', methods=['GET'])
@optional_token
def get_requests(current_user):
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
      200: {description: Elanların siyahısı}
    """
    blood_type = request.args.get('blood_type')
    city = request.args.get('city')
    urgency = request.args.get('urgency')
    status = request.args.get('status', 'active')
    user_id = request.args.get('user_id')

    if status == 'all':
        status = None

    requests_list = db.get_blood_requests(
        blood_type=blood_type, city=city, urgency=urgency, status=status,
        user_id=int(user_id) if user_id else None,
    )

    # Əlaqə nömrəsi yalnız daxil olmuş istifadəçilərə göstərilir - açıq
    # (login olunmamış) sorğularda kart-be-kart telefon sızdırılmır.
    if not current_user:
        for item in requests_list:
            item.pop('contact_phone', None)

    return jsonify({'requests': requests_list, 'count': len(requests_list)}), 200


@requests_bp.route('/requests/<int:request_id>', methods=['GET'])
@optional_token
def get_request_detail(current_user, request_id):
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
      200: {description: Elan detalları}
      404: {description: Elan tapılmadı}
    """
    req_item = db.get_blood_request_by_id(request_id)
    if not req_item:
        return jsonify({'error': 'Qan ehtiyacı elanı tapılmadı.'}), 404
    if not current_user:
        req_item.pop('contact_phone', None)
    return jsonify({'request': req_item}), 200


@requests_bp.route('/requests', methods=['POST'])
@token_required
def create_request(current_user):
    """
    Yeni Təcili Qan Ehtiyacı Elanı Yaratmaq
    ---
    tags:
      - Təcili Qan Ehtiyacları
    security: [{Bearer: []}]
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [patient_name, blood_type, hospital, city, contact_phone]
          properties:
            patient_name: {type: string, example: Məmmədov Əli}
            blood_type: {type: string, example: A+}
            hospital: {type: string, example: Mərkəzi Qan Bankı}
            city: {type: string, example: Bakı}
            units_needed: {type: integer, example: 2}
            urgency: {type: string, enum: [Urgent, Normal], example: Urgent}
            contact_phone: {type: string, example: "+994501234567"}
            note: {type: string, example: Təcili əməliyyat üçündür}
    responses:
      201: {description: Elan uğurla dərci edildi}
      400: {description: Əskik məlumatlar var}
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
    if not is_valid_phone(contact_phone):
        return jsonify({'error': 'Düzgün telefon nömrəsi daxil edin (məs: +994501234567).'}), 400

    new_req = db.create_blood_request(
        user_id=current_user['id'], patient_name=patient_name, blood_type=blood_type,
        hospital=hospital, city=city, units_needed=int(units_needed), urgency=urgency,
        contact_phone=contact_phone, note=note,
    )
    return jsonify({'message': 'Qan ehtiyacı elanı uğurla yaradıldı', 'request': new_req}), 201


@requests_bp.route('/requests/<int:request_id>', methods=['PUT'])
@token_required
def update_request(current_user, request_id):
    """
    Elanı Yeniləmək və ya Statusunu Dəyişmək
    ---
    tags:
      - Təcili Qan Ehtiyacları
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
            status: {type: string, enum: [active, fulfilled, cancelled]}
    responses:
      200: {description: Elan yeniləndi}
      403: {description: Bu elanı dəyişməyə icazəniz yoxdur}
    """
    data = request.get_json(silent=True) or {}
    if data.get('contact_phone') and not is_valid_phone(data['contact_phone']):
        return jsonify({'error': 'Düzgün telefon nömrəsi daxil edin (məs: +994501234567).'}), 400

    updated = db.update_blood_request(
        request_id=request_id, user_id=current_user['id'],
        patient_name=data.get('patient_name'), blood_type=data.get('blood_type'),
        hospital=data.get('hospital'), city=data.get('city'),
        units_needed=data.get('units_needed'), urgency=data.get('urgency'),
        contact_phone=data.get('contact_phone'), note=data.get('note'), status=data.get('status'),
    )
    if not updated:
        return jsonify({'error': 'Elan tapılmadı və ya onu redaktə etməyə səlahiyyətiniz çatmır.'}), 403
    return jsonify({'message': 'Elan uğurla yeniləndi', 'request': updated}), 200


@requests_bp.route('/requests/<int:request_id>', methods=['DELETE'])
@token_required
def delete_request(current_user, request_id):
    """
    Qan Ehtiyacı Elanını Silmək
    ---
    tags:
      - Təcili Qan Ehtiyacları
    security: [{Bearer: []}]
    parameters:
      - in: path
        name: request_id
        required: true
        type: integer
    responses:
      200: {description: Elan silindi}
      403: {description: Səlahiyyət çatışmır}
    """
    if not db.delete_blood_request(request_id=request_id, user_id=current_user['id']):
        return jsonify({'error': 'Elan tapılmadı və ya silməyə səlahiyyətiniz yoxdur.'}), 403
    return jsonify({'message': 'Qan ehtiyacı elanı uğurla silindi'}), 200
