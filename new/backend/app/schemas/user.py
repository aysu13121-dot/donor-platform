from marshmallow import fields, validate

from app.schemas.base import TrimmedSchema
from app.schemas.fields import PhoneField


class SignupSchema(TrimmedSchema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=4))
    full_name = fields.String(load_default=None, allow_none=True)
    blood_type = fields.String(load_default=None, allow_none=True)
    city = fields.String(load_default=None, allow_none=True)
    phone = PhoneField(required=True)
    bio = fields.String(load_default=None, allow_none=True)


class SigninSchema(TrimmedSchema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class UpdateProfileSchema(TrimmedSchema):
    """`PUT /me` - qismən (partial) yüklənir, ona görə burada YALNIZ
    göndərilən sahələr validasiya olunur (bax: `schema.load(.., partial=True)`
    çağırışı `app/api/auth.py`-da). `blood_type`/`city`/`phone` üçün
    `Length(min=1)`/`PhoneField` boş string göndərilməsinin qarşısını alır -
    sahə tamamilə göndərilməyibsə (partial) heç bir qeyd yoxlanmır."""

    full_name = fields.String(allow_none=True)
    blood_type = fields.String(validate=validate.Length(min=1))
    city = fields.String(validate=validate.Length(min=1))
    phone = PhoneField()
    is_available = fields.Boolean()
    last_donation_date = fields.Date(allow_none=True)
    bio = fields.String(allow_none=True)
