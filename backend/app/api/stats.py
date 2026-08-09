from flask import Blueprint, jsonify

from app.models import BloodRequest, User
from app.extensions import db

stats_bp = Blueprint('stats', __name__)


@stats_bp.get('/stats')
def get_stats():
    """Platformanın canlı statistika göstəriciləri."""
    total_donors = db.session.query(User).count()
    active_donors = db.session.query(User).filter_by(is_available=True).count()
    active_requests = db.session.query(BloodRequest).filter_by(status='active').count()
    fulfilled_requests = db.session.query(BloodRequest).filter_by(status='fulfilled').count()
    total_cities = (
        db.session.query(User.city)
        .filter(User.city.isnot(None), User.city != '')
        .distinct()
        .count()
    )
    return jsonify({'stats': {
        'total_donors': total_donors,
        'active_donors': active_donors,
        'active_requests': active_requests,
        'fulfilled_requests': fulfilled_requests,
        'total_cities': total_cities,
    }}), 200
