import re

# Azərbaycan mobil nömrəsi: +994XXXXXXXXX və ya 0XXXXXXXXX (boşluq/tire
# çıxarıldıqdan sonra). auth və requests sxemləri (app/schemas/) eyni
# qaydanı paylaşır - frontend qarşılığı SvelteKit tərəfindəki isValidPhone-dur.
PHONE_RE = re.compile(r'^(\+994|0)\d{9}$')


def is_valid_phone(phone):
    if not phone:
        return False
    return bool(PHONE_RE.match(re.sub(r'[\s-]', '', phone)))
