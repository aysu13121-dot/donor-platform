from marshmallow import fields

from app.utils.validators import is_valid_phone


class PhoneField(fields.String):
    """Telefon nömrəsi sahəsi - signup, profil yeniləmə və sorğu
    yaratma/redaktə sxemlərinin hamısında eyni qaydanı paylaşır (bax:
    app/utils/validators.py). `required=True`/`allow_none` adi
    `fields.String` kimi işləyir, sadəcə dəyər varsa format da yoxlanılır."""

    default_error_messages = {
        'invalid_phone': 'Düzgün telefon nömrəsi daxil edin (məs: +994501234567).',
    }

    def _validate(self, value):
        super()._validate(value)
        if not is_valid_phone(value):
            raise self.make_error('invalid_phone')
