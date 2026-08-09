import re

# Azərbaycan mobil nömrəsi: +994XXXXXXXXX və ya 0XXXXXXXXX (boşluq/tire
# çıxarıldıqdan sonra). auth.py (signup, profil) və requests.py (elan
# yaratma/redaktə) eyni qaydanı paylaşır - frontend qarşılığı
# frontend/src/lib/utils.js-dəki isValidPhone-dur.
PHONE_RE = re.compile(r'^(\+994|0)\d{9}$')


def is_valid_phone(phone):
    return bool(PHONE_RE.match(re.sub(r'[\s-]', '', phone)))
