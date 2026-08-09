from apiflask import APIBlueprint
from flask import jsonify
from flask_jwt_extended import current_user, jwt_required

from app.extensions import db
from app.models import User
from app.schemas.user import DonorQuerySchema

donors_bp = APIBlueprint('donors', __name__, tag='Donor Axtarışı')


@donors_bp.get('/donors')
@donors_bp.input(DonorQuerySchema, location='query')
@jwt_required(optional=True)
def get_donors(query_data):
    """Donorların siyahısı, filtrasiya və səhifələmə ilə. Telefon nömrəsi
    yalnız daxil olmuş istifadəçilərə göstərilir (bax: User.to_dict)."""
    query = User.query
    if query_data['blood_type']:
        query = query.filter_by(blood_type=query_data['blood_type'])
    if query_data['city']:
        query = query.filter_by(city=query_data['city'])
    if query_data['is_available'] is not None:
        query = query.filter_by(is_available=query_data['is_available'])

    total = query.count()
    page, limit = query_data['page'], query_data['limit']
    donors = query.order_by(User.id.desc()).offset((page - 1) * limit).limit(limit).all()
    total_pages = (total + limit - 1) // limit if total else 0

    include_phone = bool(current_user)
    return jsonify({
        'donors': [donor.to_dict(include_phone=include_phone) for donor in donors],
        'count': len(donors),
        'pagination': {'page': page, 'limit': limit, 'total': total, 'total_pages': total_pages},
    }), 200


@donors_bp.get('/donors/<int:donor_id>')
@jwt_required(optional=True)
def get_donor_detail(donor_id):
    donor = db.session.get(User, donor_id)
    if not donor:
        return jsonify({'error': 'Donor tapılmadı.'}), 404
    include_phone = bool(current_user)
    return jsonify({'donor': donor.to_dict(include_phone=include_phone)}), 200
