from app.extensions import db


class BloodRequest(db.Model):
    __tablename__ = 'blood_requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    patient_name = db.Column(db.String(255), nullable=False)
    blood_type = db.Column(db.String(5), nullable=False)
    hospital = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    units_needed = db.Column(db.Integer, nullable=False, default=1)
    urgency = db.Column(db.String(20), nullable=False, default='Urgent')
    contact_phone = db.Column(db.String(20), nullable=False)
    note = db.Column(db.Text)
    status = db.Column(db.String(20), nullable=False, default='active')
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())

    author = db.relationship('User', back_populates='requests')

    def to_dict(self, *, include_phone=True):
        """Login olmayan istifadəçilər üçün `include_phone=False` -
        əlaqə nömrəsi siyahı/detal cavablarından çıxarılır (bax: User.to_dict)."""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'patient_name': self.patient_name,
            'blood_type': self.blood_type,
            'hospital': self.hospital,
            'city': self.city,
            'units_needed': self.units_needed,
            'urgency': self.urgency,
            'note': self.note,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'author_name': self.author.full_name if self.author else None,
        }
        if include_phone:
            data['contact_phone'] = self.contact_phone
        return data
