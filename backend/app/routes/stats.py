from flask import Blueprint, jsonify

from app.models import db

stats_bp = Blueprint('stats', __name__)


@stats_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Platformanın Canlı Statistika Göstəriciləri
    ---
    tags:
      - Platforma Statistikası
    responses:
      200: {description: Statistika məlumatları}
    """
    return jsonify({'stats': db.get_platform_stats()}), 200
