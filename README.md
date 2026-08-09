# Donor.az — Qan Donorluğu Platforması

Azərbaycan üzrə təcili qan donorluğu platforması.

```
backend/    Flask API (APIFlask + SQLAlchemy + Postgres)
frontend/   SvelteKit tətbiqi
```

## Lokal işə salma

### Backend

```bash
cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
copy .env.example .env      # DATABASE_URL, SECRET_KEY, CORS_ORIGINS doldurun
set FLASK_APP=run.py
flask db upgrade
python run.py                # http://127.0.0.1:5000
```

Test: `pytest -q`

### Frontend

```bash
cd frontend
copy .env.example .env      # PUBLIC_API_URL + JWT_SECRET_KEY (backend-in SECRET_KEY-i ilə eyni)
npm install
npm run dev                  # http://localhost:5173
```

## Struktur

```
backend/app/
  models/     SQLAlchemy modelləri
  schemas/     Marshmallow sxemləri
  api/         blueprint-lər (auth, donors, requests, stats)

frontend/src/
  routes/       səhifələr
  lib/           komponentlər, api müştəriləri
  hooks.server.js  auth + i18n
```

Seed/demo data yoxdur — istifadəçilər yalnız `/signup` ilə yaranır.
