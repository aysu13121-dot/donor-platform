# Donor.az - Qan Donorluğu Platforması

Azərbaycan üzrə təcili qan donorluğu platforması.

```
backend/    Flask API (APIFlask + SQLAlchemy + Postgres)
frontend/   SvelteKit tətbiqi
```

## Verilənlər bazası

Layihə Postgres tələb edir (SQLite dəstəklənmir). Lokal quraşdırma/Docker
əvəzinə **[Neon](https://neon.tech)** tövsiyə olunur - pulsuz, saniyələr
içində layihə yaradıb bağlantı sətrini götürə bilərsiniz, Docker/yerli
Postgres quraşdırmağa ehtiyac qalmır.

## Lokal işə salma

### Backend

```bash
cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
copy .env.example .env
```

`.env`-də doldurulmalı olanlar:

| Dəyişən | Nə üçün |
|---|---|
| `DATABASE_URL` | Neon-dan götürdüyünüz Postgres bağlantı sətri |
| `SECRET_KEY` | təsadüfi uzun sətir (`python -c "import secrets; print(secrets.token_hex(32))"`) |
| `CORS_ORIGINS` | frontend ünvanı, lokal `http://localhost:5173` |

Qalanları (`TEST_DATABASE_URL`, `FLASK_DEBUG`, `PORT`, `JWT_COOKIE_SECURE`, `JWT_EXPIRY_DAYS`) defolt dəyərləri ilə saxlanıla bilər.

```bash
set FLASK_APP=run.py
flask db upgrade
python run.py                # http://127.0.0.1:5000
```

Test: `pytest -q`

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev                  # http://localhost:5173
```

`.env`-də doldurulmalı olanlar:

| Dəyişən | Nə üçün |
|---|---|
| `PUBLIC_API_URL` | backend ünvanı, lokal `http://localhost:5000` |
| `JWT_SECRET_KEY` | backend-in `.env`-indəki `SECRET_KEY` ilə **eyni** dəyər olmalıdır |

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

## Deploy

Neon (DB) artıq bulud üzərindədir. Backend (`gunicorn`, `Procfile` hazır) və
frontend (`adapter-node`, `node build`) ayrı-ayrı "web service" kimi istənilən
platformada (Railway, Render və s.) qaldırıla bilər.

Öz domenin yoxdursa (platformanın verdiyi təsadüfi subdomain-lər istifadə
olunacaqsa), backend `.env`-də:

```
JWT_COOKIE_SECURE=True
JWT_COOKIE_SAMESITE=None
CORS_ORIGINS=<frontend-in prod ünvanı>
```

qoyulmalıdır - fərqli subdomain-lər fərqli "site" sayıldığı üçün brauzer
`Lax` cookie-ni cross-site sorğularda göndərmir. Öz domenin olub frontend/
backend-i onun subdomain-lərinə (`app.sayt.az` + `api.sayt.az`) qoysan, bu
addım lazım deyil - defolt `Lax` kifayətdir.

Frontend `.env`-də əlavə olaraq `ORIGIN=<öz prod ünvanı>` lazımdır
(`adapter-node` tələb edir). Deploy sonrası bir dəfə `flask db upgrade`
işə salınmalıdır ki, Neon-da cədvəllər yaransın.

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