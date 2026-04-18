# InternBeacon — frontend

Next.js 16 + React 19 + Tailwind CSS v4.

This frontend is now connected to the backend API for:
- auth (login/signup)
- student dashboard data
- employer dashboard data
- listings and internship detail

Canonical setup docs are in the root README: `../README.md`.

## Commands

```bash
npm install
npm run dev    # http://localhost:3000 (or 3001 if 3000 is busy)
npm run build
npm start
npm run lint
```

## Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

An example file is provided:
- `frontend/.env.example`

## Entry points

- App routes: `app/`
- Shared components: `src/components/`
- API client/auth helpers: `src/lib/api.ts`
- Route index (dev): `/dev/pages`

## Notes

- Role-based redirect after login/signup:
  - STUDENT -> `/dashboard`
  - COMPANY -> `/employer/dashboard`
  - ADMIN -> `/admin/dashboard`
- Auth state currently stored in localStorage via `src/lib/api.ts`.
- Some legacy pages still have lint issues; production build is passing.
