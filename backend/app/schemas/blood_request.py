from apiflask import Schema
from marshmallow import fields, validate

from app.schemas.base import TrimmedSchema
from app.schemas.fields import PhoneField

URGENCY_CHOICES = ['Urgent', 'Normal']
STATUS_CHOICES = ['active', 'fulfilled', 'cancelled']


class CreateRequestSchema(TrimmedSchema):
    patient_name = fields.String(required=True, validate=validate.Length(min=1))
    blood_type = fields.String(required=True, validate=validate.Length(min=1))
    hospital = fields.String(required=True, validate=validate.Length(min=1))
    city = fields.String(required=True, validate=validate.Length(min=1))
    units_needed = fields.Integer(load_default=1, validate=validate.Range(min=1))
    urgency = fields.String(load_default='Urgent', validate=validate.OneOf(URGENCY_CHOICES))
    contact_phone = PhoneField(required=True)
    note = fields.String(load_default=None, allow_none=True)


class UpdateRequestSchema(TrimmedSchema):
    """`PUT /requests/<id>` - qismən yüklənir (bax: CreateRequestSchema-dan
    fərqli olaraq heç bir sahə `required` deyil), yalnız göndərilən
    sahələr dəyişdirilir."""

    patient_name = fields.String(validate=validate.Length(min=1))
    blood_type = fields.String(validate=validate.Length(min=1))
    hospital = fields.String(validate=validate.Length(min=1))
    city = fields.String(validate=validate.Length(min=1))
    units_needed = fields.Integer(validate=validate.Range(min=1))
    urgency = fields.String(validate=validate.OneOf(URGENCY_CHOICES))
    contact_phone = PhoneField()
    note = fields.String(allow_none=True)
    status = fields.String(validate=validate.OneOf(STATUS_CHOICES))


class RequestQuerySchema(Schema):
    blood_type = fields.String(load_default=None)
    city = fields.String(load_default=None)
    urgency = fields.String(load_default=None)
    status = fields.String(load_default='active')
    user_id = fields.Integer(load_default=None, allow_none=True)
