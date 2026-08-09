from apiflask import Schema
from marshmallow import pre_load


class TrimmedSchema(Schema):
    """Bütün string sahələrdəki baş/son boşluqları JSON gələn kimi avtomatik
    təmizləyir - köhnə backend-də hər sahə üçün əl ilə təkrarlanan
    `.strip() if x else None` pattern-inin əvəzinə, bir dəfə burada."""

    @pre_load
    def _strip_strings(self, data, **kwargs):
        if not isinstance(data, dict):
            return data
        return {key: (value.strip() if isinstance(value, str) else value) for key, value in data.items()}
