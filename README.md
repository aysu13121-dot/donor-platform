# Regional Qan Donoru Sistemi 🩸

A full-stack web platform connecting blood donors with recipients across Azerbaijan.

## Tech Stack
- **Backend:** Python, Flask, SQLite, JWT, Swagger/Flasgger
- **Frontend:** React, Vite, React Router DOM

## Getting Started

### Backend
```bash
py -m pip install -r requirements.txt
py app.py
```
Runs on: http://localhost:5000  
Swagger docs: http://localhost:5000/apidocs/

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/signup | Register a new donor |
| POST | /api/login | Login and receive JWT token |
| GET | /api/donors | Get list of donors |
| GET | /api/me | Get current user (auth required) |


