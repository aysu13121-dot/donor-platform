# Qan Donoru Platforması

Sıfırdan, təmiz mimari ilə yazılmış versiya:

```
backend/    Flask API (blueprint-lərə bölünmüş, testli, deploy-a hazır)
frontend/   Next.js 15 (App Router) tətbiqi
```

Köhnə versiya (vanilla-JS/React + tək fayllı Flask) tamamilə silinib —
bu, artıq layihənin yeganə versiyasıdır.

## Nə dəyişdi (köhnə versiya ilə müqayisə)

- **Backend** blueprint-lərə bölündü (`auth`, `donors`, `requests`, `offers`, `stats`),
  app-factory pattern (`create_app()`), config `.env`-dən oxunur.
- `database.py`-dəki təkrarlanan `get_offers_for_request` funksiyası silindi.
- `/api/profile` və `/api/me` PUT dublikatı — indi tək `/api/me` (GET/PUT/DELETE).
- `SECRET_KEY` üçün hardcoded fallback yoxdur; `.env`-də təyin olunmayıbsa
  server hər dəfə təsadüfi açarla başlayır və konsola aydın xəbərdarlıq yazır.
- 28 pytest testi əlavə olundu (əvvəlki versiyada heç test yox idi).
- `gunicorn` + `Procfile` əlavə olundu — production-da Flask-ın development
  serverindən istifadə edilmirdi.
- **Frontend** React+Vite-dan Next.js-ə (App Router) köçürüldü:
  - Backend URL-i 6 fərqli fayldan `NEXT_PUBLIC_API_URL` env dəyişəninə çıxarıldı
    (əvvəllər hər yerdə `http://localhost:5000` hardcoded idi — deploy-da işləməzdi).
  - Mərkəzi `lib/api.js` — bütün fetch/auth-header/xəta emalı tək yerdə.
  - `AuthContext` əlavə olundu — token/istifadəçi state-i React context-də saxlanılır,
    `Navbar`-dakı `window.location.reload()` hack-i artıq lazım deyil.
  - İki paralel i18n sistemi (`LanguageContext` + hər səhifədə ayrı `COPY` obyekti)
    tək `LanguageContext`-də birləşdirildi; Donors səhifəsi əvvəllər ümumiyyətlə
    tərcüməyə qoşulmamışdı və diakritiksiz mətnlər var idi (`Butun` → `Bütün`) — düzəldildi.
  - Ana səhifədəki statistika bloku artıq statik ədədlər deyil, canlı `/api/stats`-dan gəlir.
  - 404 route əlavə olundu (Next.js-in `not-found.jsx` konvensiyası ilə avtomatik).
  - Signup indi backend-dən JWT alır və istifadəçini dərhal login edir (əvvəlki
    versiyada signup token qaytarmırdı, amma frontend `data.token`-i istifadə
    etməyə çalışırdı — səssiz bug idi).

## Məlum sadələşdirmə

Auth JWT-si `localStorage`-da saxlanılır (backend-in Bearer-token modelinə uyğun
olaraq, əvvəlki versiyadakı kimi). Bu o deməkdir ki, route qorunması (`ProtectedRoute`)
server middleware-i ilə deyil, client-də yoxlanılır. Daha möhkəm həll üçün gələcəkdə
`httpOnly` cookie-ə keçid düşünülə bilər, amma bu, backend-də də dəyişiklik tələb edir.

---

## Lokal işə salma

### Backend

```bash
cd backend
py -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements-dev.txt
copy .env.example .env          # SECRET_KEY-i dəyişin
python run.py
```

API `http://127.0.0.1:5000`-də, Swagger sənədləşməsi `http://127.0.0.1:5000/apidocs/`-də olacaq.

Testləri işə salmaq üçün:

```bash
pytest -q
```

### Frontend

```bash
cd frontend
copy .env.example .env.local    # NEXT_PUBLIC_API_URL backend ünvanınıza uyğun olmalıdır
npm install
npm run dev
```

`http://localhost:3000`-də açılacaq (əgər 3000 məşğuldursa, Next avtomatik
başqa portdan istifadə edir — o zaman backend-in `.env`-indəki `CORS_ORIGINS`-i
həmin portla uyğunlaşdırmağı unutmayın).

---

## Deploy

### Backend (Render / Railway / Fly.io və s.)

- `Procfile` artıq mövcuddur: `web: gunicorn run:app`
- Environment variables: `SECRET_KEY` (mütləq, təsadüfi uzun sətir),
  `CORS_ORIGINS` (frontend-in production domenini yazın, `*` yox),
  `DATABASE_PATH` (əgər platformada persistent disk varsa, oraya yönləndirin —
  əks halda SQLite faylı hər deploy-da sıfırlanacaq).
- `pip install -r requirements.txt` build addımı kimi işlədilməlidir.

### Frontend (Vercel / Netlify / və ya eyni backend-in üzərindən statik)

- Environment variable: `NEXT_PUBLIC_API_URL` — backend-in production URL-i.
- `npm run build` → `npm run start` (Node runtime lazımdır) və ya Vercel-ə birbaşa
  push, platform bunu avtomatik tanıyır.

---

## Struktur

```
backend/
  app/
    __init__.py       # create_app() – app factory
    config.py         # env-based konfiqurasiya
    models/db.py       # SQLite giriş qatı
    routes/            # auth, donors, requests, offers, stats blueprint-ləri
    utils/auth.py       # token_required dekoratoru
  tests/               # pytest (28 test)
  run.py
  Procfile

frontend/
  src/
    app/               # Next.js App Router səhifələri
    components/        # Navbar, ProtectedRoute
    context/           # AuthContext, LanguageContext
    lib/               # api.js (mərkəzi fetch), constants.js
```
