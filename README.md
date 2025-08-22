# Erino Lead Management - Full Code Starter

## What's included
- Backend: Express server using lowdb (file JSON) for ease of local testing.
- Frontend: Vite + React app with basic Leads list, create/edit form, login/register.
- Auth: JWT stored in httpOnly cookie (login/register/logout/me).
- Seed: Backend seeds 120 leads and a test user (test@demo.com / password).

## Run locally
1. Backend
   ```
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
   Backend will run on http://localhost:4000

2. Frontend
   ```
   cd ../frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173 (Vite)

## Notes
- Frontend axios uses `withCredentials: true` so cookies are sent.
- The DB is stored in `backend/db.json` (lowdb). For production you should replace with Postgres/Mongo and deploy.

Test user:
- email: test@demo.com
- password: password
