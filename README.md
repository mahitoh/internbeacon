# InternBeacon

InternBeacon is an internship matching + search platform built with a **simple production structure**:
- `apps/web` → Next.js frontend
- `apps/api` → Node.js backend API

> Goal: keep it clean, scalable, and easy for solo dev / small team workflows without heavy monorepo tooling.

---

## Why this structure (without Turborepo)

You asked for production quality, but not unnecessary complexity.

This repo uses **npm workspaces only** (lightweight) so you still get:
- shared root scripts (`dev`, `build`, `lint`, `typecheck`, `test`)
- separate deployment targets for frontend and backend
- clear boundaries between web and API

And you avoid:
- extra task-runner config overhead
- additional DX complexity early in the project

---

## Project structure

```text
internbeacon/
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR/push checks
│       └── deploy.yml          # Deploy placeholders
├── apps/
│   ├── web/                    # Next.js app (frontend)
│   └── api/                    # Node.js + Express API
├── .env.example                # root shared env template
├── package.json                # root workspace scripts
└── README.md
```

### API structure (`apps/api`)

```text
apps/api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.ts                  # express app + middleware
│   └── server.ts               # server bootstrap
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Docs strategy (important)

You are absolutely right: many big repos do **not** keep huge docs trees inside the codebase.

For this project, use this practical rule:

- Keep **critical onboarding docs in `README.md`** (always in-repo).
- Keep long product/design docs in **Notion / Wiki / Google Docs** if your team prefers.
- Add only a small in-repo `/docs` folder **later** if contributor count and complexity grow.

So: **README-first now, docs folder optional later**.

---

## Quick start

## 1) Create frontend app

If `apps/web` is not yet initialized:

```bash
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## 2) Install dependencies

```bash
npm install
```

## 3) Run apps

```bash
npm run dev
```

- web app command runs via: `npm run dev:web`
- API command runs via: `npm run dev:api`

---

## Environment setup

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

Set your values before production deploy.

---

## Workspace scripts

From repo root:

```bash
npm run dev         # run web + api together
npm run dev:web     # run frontend only
npm run dev:api     # run backend only
npm run build       # build all workspaces
npm run lint        # lint all workspaces
npm run typecheck   # typecheck all workspaces
npm run test        # test all workspaces
```

---

## CI/CD overview

### CI (`.github/workflows/ci.yml`)
Runs on:
- pull requests to `main`
- pushes to `main`

Checks:
- install dependencies (`npm ci`)
- lint
- typecheck
- test

### Deploy (`.github/workflows/deploy.yml`)
Runs on:
- push to `main`

Contains placeholder jobs for:
- web deployment (Vercel or your provider)
- api deployment (Render / Railway / Fly.io / etc.)

Wire provider secrets before enabling real deployment steps.

---

## Production notes

- Keep backend logic in `services/`, not controllers.
- Keep route handlers thin and validation strict.
- Add rate limiting + auth middleware before public launch.
- Add observability (Sentry/log drains/uptime checks) before scale.
- Add integration tests for matching + search flows early.

---

## Next steps recommended

1. Initialize `apps/web` fully with Next.js (if still placeholder).
2. Add request validation (`zod`) in API.
3. Add database layer (Prisma + Postgres).
4. Add auth (Clerk / Better Auth / custom JWT).
5. Replace deploy placeholders with real provider actions.