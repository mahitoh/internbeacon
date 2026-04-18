# InternBeacon Backend

Node.js + Express + Prisma backend for InternBeacon.

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env` with required values:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

Initialize Prisma:

```bash
npx prisma generate
npx prisma db push
```

Run server:

```bash
npm run dev
# or
npm start
```

Server defaults to:
- `http://localhost:5000`
- health: `GET /health`
- docs: `GET /api-docs`

## API base path

All API routes are mounted under:

`/api/v1`

Examples:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/offers`
- `GET /api/v1/offers/:id`
- `GET /api/v1/students/profile`
- `GET /api/v1/companies/profile`

## Notes

- Public company profile route is available at:
  - `GET /api/v1/companies/public/:id`
- Protected routes require:
  - `Authorization: Bearer <token>`
