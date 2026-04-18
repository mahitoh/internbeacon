# InternBeacon

Curated internships for students, and a serious hiring console for employers.

InternBeacon currently runs as:
- frontend: Next.js 16 app in `frontend/`
- backend: Node.js/Express + Prisma API in `backend/`

This README is the source of truth for running both together.

---

## Architecture

- Frontend (`frontend/`)
  - Next.js 16 + React 19 + Tailwind v4
  - Auth pages (`/login`, `/signup`) call backend API
  - Student/employer dashboards are wired to authenticated backend endpoints
  - Listings and internship detail fetch live offers from backend (with UI fallback)

- Backend (`backend/`)
  - Express 5 + Prisma + PostgreSQL
  - API base path: `/api/v1`
  - JWT auth using `Authorization: Bearer <token>`

---

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (Neon/local/etc.)

---

## 1) Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with real values:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- optional service keys (AI/email/SMS)

Initialize Prisma:

```bash
npx prisma generate
npx prisma db push
```

Run backend:

```bash
npm run dev
# or
npm start
```

Backend should be available at:
- `http://localhost:5000/health`
- `http://localhost:5000/api-docs`

---

## 2) Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

`frontend/.env.local` should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Run frontend:

```bash
npm run dev
```

Open:
- `http://localhost:3000`

If port 3000 is busy, Next.js will use 3001 automatically.

---

## 3) Run both together (two terminals)

Terminal A:
```bash
cd backend
npm run dev
```

Terminal B:
```bash
cd frontend
npm run dev
```

Then test flow:
1. Open `/signup`
2. Create account (student or company)
3. You should be redirected by role:
   - STUDENT -> `/dashboard`
   - COMPANY -> `/employer/dashboard`
   - ADMIN -> `/admin/dashboard`
4. Login works at `/login` with same redirect behavior

---

## Integrated routes/endpoints

### Auth
Frontend:
- `/login`
- `/signup`

Backend:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`

### Student
Frontend pages wired:
- `/dashboard`
- `/dashboard/applications`
- `/dashboard/recommendations`
- `/dashboard/profile`

Backend endpoints used:
- `GET /api/v1/students/profile`
- `GET /api/v1/students/stats`
- `GET /api/v1/students/applications`
- `GET /api/v1/students/recommendations`

### Employer
Frontend pages wired:
- `/employer/dashboard`
- `/employer/applicants`
- `/employer/profile`

Backend endpoints used:
- `GET /api/v1/companies/profile`
- `GET /api/v1/companies/offers`
- `GET /api/v1/companies/applicants`
- `PUT /api/v1/applications/status` (from applicants page status dropdown)

### Offers (public)
Frontend:
- `/listings`
- `/internships/[id]`

Backend:
- `GET /api/v1/offers`
- `GET /api/v1/offers/:id`

---

## Build and verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend quick health check:

```bash
curl http://localhost:5000/health
```

---

## Notes

- Frontend stores auth token/user in localStorage for now.
- API client lives in `frontend/src/lib/api.ts`.
- If backend is unavailable, listings/detail pages fall back to mock UI data.
- There are still many existing lint issues in untouched pages; build is passing.

---

## Project structure (current)

```text
internbeacon/
├── README.md
├── backend/
│   ├── server.js
│   ├── prisma/schema.prisma
│   └── src/
│       ├── routes/
│       ├── controllers/
│       └── services/
└── frontend/
    ├── app/
    ├── src/components/
    └── src/lib/
```

---

## Troubleshooting

- 401 Unauthorized on dashboard pages:
  - Login again at `/login` to refresh token in localStorage.
- CORS errors:
  - Ensure backend is running and `FRONTEND_URL` (if set) matches your frontend origin.
- Empty student/company pages:
  - Ensure the logged-in user has the correct role/profile created via `/signup`.
- API URL wrong:
  - Check `frontend/.env.local` -> `NEXT_PUBLIC_API_URL`.
