# Donor.az — Qan Donorluğu Platforması

Azərbaycan üzrə təcili qan donorluğu platforması: donor axtarışı, qan
ehtiyacı elanları, dashboard-dan idarəetmə.

```
backend/    Flask API (APIFlask + SQLAlchemy + Postgres, cookie-based JWT auth)
frontend/   SvelteKit tətbiqi (Svelte 5, Tailwind v4, paraglide i18n)
```

## Stek

**Backend**
- Flask + [APIFlask](https://apiflask.com/) (Marshmallow sxemləri, avtomatik OpenAPI sənədləşməsi)
- Flask-SQLAlchemy + Flask-Migrate (PostgreSQL, [Neon](https://neon.tech) kimi bulud instansiyaları ilə uyğun)
- Flask-JWT-Extended — JWT httpOnly cookie-də saxlanılır (`localStorage` yox)
- Flask-Limiter — auth endpoint-lərində rate limiting
- pytest (41 test)

**Frontend**
- SvelteKit (Svelte 5, runes), TypeScript-siz (jsconfig.json + JSDoc)
- Tailwind CSS v4
- [paraglide-js](https://paraglidejs.com/) — AZ/EN i18n, cookie-əsaslı dil seçimi
- Auth vəziyyəti server-side (`hooks.server.js`) JWT-ni yerində yoxlayır — client-side
  "flash of wrong content" riski yoxdur, backend-ə auth üçün əlavə sorğu getmir
- `+page.server.js` `load()` funksiyaları ilə server-side data fetching

## Lokal işə salma

### Backend

```bash
cd backend
py -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements-dev.txt
copy .env.example .env
```

`.env`-də doldurulmalı olanlar:
- `DATABASE_URL` — Postgres bağlantı sətri (Neon-da pulsuz layihə yaradıb götürə bilərsiniz)
- `SECRET_KEY` — təsadüfi uzun sətir (`python -c "import secrets; print(secrets.token_hex(32))"`)
- `CORS_ORIGINS` — frontend-in ünvanı (lokal `http://localhost:5173`)

```bash
set FLASK_APP=run.py        # Windows cmd (PowerShell: $env:FLASK_APP='run.py')
flask db upgrade            # miqrasiyaları tətbiq et
python run.py
```

API `http://127.0.0.1:5000`-də olacaq. Testləri işə salmaq üçün:

```bash
pytest -q
```

### Frontend

```bash
cd frontend
copy .env.example .env    # PUBLIC_API_URL və JWT_SECRET_KEY-i doldurun
npm install
npm run dev
```

`.env`-də:
- `PUBLIC_API_URL` — backend ünvanı (lokal `http://localhost:5000`)
- `JWT_SECRET_KEY` — **backend-in `.env`-indəki `SECRET_KEY` ilə eyni** olmalıdır
  (auth cookie-sinin imzasını server-side yoxlamaq üçün)

`http://localhost:5173`-də açılacaq.

## Struktur

```
backend/
  app/
    __init__.py        # create_app() – APIFlask app factory
    extensions.py       # db, jwt, cors, limiter instansiyaları
    config.py           # env-based konfiqurasiya
    models/              # SQLAlchemy modelləri (User, BloodRequest)
    schemas/             # Marshmallow sxemləri (validasiya + serialization)
    api/                 # auth, donors, requests, stats blueprint-ləri
    jwt_callbacks.py      # Flask-JWT-Extended callback-ləri
  migrations/            # Alembic miqrasiyaları
  tests/                 # pytest

frontend/
  src/
    routes/              # SvelteKit səhifələri (fayl-əsaslı routing)
    lib/
      components/         # paylaşılan Svelte komponentləri (ui/, dashboard/)
      server/api.js        # server-side (load funksiyaları üçün) API müştərisi
      api.js                # client-side (mutasiyalar üçün) API müştərisi
    hooks.server.js       # auth (JWT yoxlaması) + i18n middleware
  messages/               # az.json / en.json (paraglide mesaj kataloqu)
```

## Qeyd

Seed/demo data yoxdur — istifadəçilər yalnız `/signup` vasitəsilə yaranır.
