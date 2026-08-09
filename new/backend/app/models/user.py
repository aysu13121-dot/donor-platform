from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))
    blood_type = db.Column(db.String(5))
    city = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False, default='donor')
    is_available = db.Column(db.Boolean, nullable=False, default=True)
    last_donation_date = db.Column(db.Date)
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())

    requests = db.relationship(
        'BloodRequest', back_populates='author', cascade='all, delete-orphan',
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, *, include_phone=True):
        """Donor/requests siyahılarında ("optional auth" endpoint-lərdə)
        `include_phone=False` ötürülür ki, login olmayan istifadəçilərə
        telefon nömrəsi sızmasın.
        """
        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'blood_type': self.blood_type,
            'city': self.city,
            'role': self.role,
            'is_available': self.is_available,
            'last_donation_date': self.last_donation_date.isoformat() if self.last_donation_date else None,
            'bio': self.bio,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_phone:
            data['phone'] = self.phone
        return data
