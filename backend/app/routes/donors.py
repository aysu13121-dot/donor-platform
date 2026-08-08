from flask import Blueprint, jsonify, request

from app.models import db

donors_bp = Blueprint('donors', __name__)


@donors_bp.route('/donors', methods=['GET'])
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
      - in: query
        name: page
        type: integer
        description: Səhifə nömrəsi (default 1)
      - in: query
        name: limit
        type: integer
        description: Səhifə başına nəticə sayı (default 10, maksimum 100)
    responses:
      200: {description: Donorların siyahısı (pagination məlumatı ilə)}
      400: {description: page və ya limit düzgün rəqəm deyil}
    """
    blood_type = request.args.get('blood_type')
    city = request.args.get('city')
    is_avail_raw = request.args.get('is_available')
    is_avail = int(is_avail_raw) if is_avail_raw in ('0', '1') else None

    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
    except (TypeError, ValueError):
        return jsonify({'error': 'page və limit tam ədəd olmalıdır.'}), 400

    if page < 1 or limit < 1:
        return jsonify({'error': 'page və limit müsbət ədəd olmalıdır.'}), 400
    limit = min(limit, 100)
    offset = (page - 1) * limit

    donors = db.get_all_donors(blood_type=blood_type, city=city, is_available=is_avail, limit=limit, offset=offset)
    total = db.count_donors(blood_type=blood_type, city=city, is_available=is_avail)
    total_pages = (total + limit - 1) // limit if total else 0

    return jsonify({
        'donors': donors,
        'count': len(donors),
        'pagination': {'page': page, 'limit': limit, 'total': total, 'total_pages': total_pages},
    }), 200


@donors_bp.route('/donors/<int:donor_id>', methods=['GET'])
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
      200: {description: Donor məlumatları}
      404: {description: Donor tapılmadı}
    """
    donor = db.get_user_by_id(donor_id)
    if not donor or donor.get('role') != 'donor':
        return jsonify({'error': 'Donor tapılmadı.'}), 404
    donor.pop('password_hash', None)
    return jsonify({'donor': donor}), 200
