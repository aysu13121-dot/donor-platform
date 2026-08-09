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

## API

Tam interaktiv sənədləşmə: server işə düşəndən sonra `http://localhost:5000/docs`.

| Metod | Endpoint | Təsvir | Auth |
|---|---|---|---|
| POST | `/api/signup` | Qeydiyyat | — |
| POST | `/api/signin` | Giriş | — |
| POST | `/api/logout` | Çıxış | — |
| GET | `/api/me` | Öz profilin | ✔ |
| PUT | `/api/me` | Profili yenilə | ✔ |
| DELETE | `/api/me` | Hesabı sil | ✔ |
| GET | `/api/donors` | Donor siyahısı (filtr, səhifələmə) | ixt. |
| GET | `/api/donors/{id}` | Donor detalı | ixt. |
| GET | `/api/requests` | Sorğu siyahısı (filtr) | ixt. |
| POST | `/api/requests` | Yeni sorğu yarat | ✔ |
| GET | `/api/requests/{id}` | Sorğu detalı | ixt. |
| PUT | `/api/requests/{id}` | Sorğunu yenilə (yalnız sahibi) | ✔ |
| DELETE | `/api/requests/{id}` | Sorğunu sil (yalnız sahibi) | ✔ |
| GET | `/api/stats` | Platforma statistikası | — |
| GET | `/api/health` | Health check | — |

"ixt." (ixtiyari) = auth olmadan da işləyir, amma daxil olmuş istifadəçiyə
əlavə məlumat (telefon nömrəsi) göstərir.

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
