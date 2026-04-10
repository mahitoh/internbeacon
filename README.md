# InternBeacon

**Curated internships for students. A serious hiring console for employers.**  
InternBeacon is a Next.js application for browsing roles, tracking applications, and managing employer workflows—styled as a premium marketplace with a consistent app shell across student and company experiences.

---

## Why InternBeacon exists

Students waste time in scattered WhatsApp groups and unvetted listings. Employers need a single place to post roles and review applicants without losing context. This codebase is the **UI foundation**: routes, layouts, and design system tokens are wired so you can plug in auth, a real API, and data later without redrawing every screen.

---

## What you get today

| Area | Routes | Purpose |
|------|--------|---------|
| **Marketing** | `/`, `/browse`, `/discover`, `/listings` | Landing, search/browse, discovery, editorial listings index |
| **Auth** | `/login`, `/signup` | Sign-in flows (UI) |
| **Student console** | `/dashboard`, `/dashboard/feed`, `/dashboard/applications`, `/dashboard/profile` | Home stats, social-style feed, tracker, profile |
| **Employer console** | `/employer/dashboard`, `/employer/applicants`, `/employer/messages`, `/employer/post` | Command center, pipeline, chat, posting wizard |
| **Detail** | `/internships/[id]`, `/offers/[id]`, `/company/[id]` | Dynamic detail placeholders |
| **Dev** | `/dev/pages` | Clickable index of all static routes while building |

Layouts enforce **one sidebar width (`w-72`)**, **shared padding**, and **mobile top navigation** so the product does not feel like a pile of unrelated HTML exports.

---

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS v4** (`@import "tailwindcss"` + `@theme` tokens in `app/globals.css`)
- **Material Symbols** (icons, loaded in root layout)
- **shadcn-style primitives** (`cn`, `Card`, Base UI `Button` where applicable)
- **Design source**: HTML references live in `stitch_assets/` (and mirrored under `frontend/public/assets/` for static peek)

---

## Repository layout

```text
internbeacon/
├── README.md                 # You are here
├── stitch_assets/            # Original Stitch / export HTML (reference)
└── frontend/                 # Next.js application — this is what you run
    ├── app/                  # Routes + route-group layouts
    │   ├── layout.tsx        # Fonts, Material Symbols, global body classes
    │   ├── globals.css       # Tailwind theme + design tokens
    │   ├── dashboard/
    │   │   └── layout.tsx    # Student shell (sidebar + footer)
    │   └── employer/
    │       └── layout.tsx    # Employer shell (sidebar, no heavy footer)
    ├── public/
    │   └── assets/
    │       └── logo.svg
    └── src/
        ├── components/       # Navbar, Footer, Logo, Sidebar, shells, ui/
        └── lib/                # utils, data helpers
```

> **Note:** An older README may have described `apps/web` and `apps/api`. The current source of truth for the UI is **`frontend/`**. Add a separate API service when you are ready and link it from here.

---

## Quick start

### Requirements

- **Node.js 20+** (LTS recommended)
- **npm** (ships with Node)

### Install and run

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
cd frontend
npm run build
npm start
```

### Lint

```bash
cd frontend
npm run lint
```

---

## Environment variables

There is no hard dependency on `.env` for the static UI. When you add API calls, auth, or analytics, create `frontend/.env.local` (never commit secrets) and document each variable in this section.

Suggested placeholders for a real launch:

- `NEXT_PUBLIC_APP_URL` — canonical site URL
- `DATABASE_URL` — if you add Prisma / Drizzle later
- `AUTH_SECRET` — session/JWT signing
- Provider keys (OAuth, email, uploads) as needed

---

## Design system (short)

Semantic colors and fonts are defined in `app/globals.css` under `@theme` (e.g. `on-primary-fixed`, `secondary-container`, `surface-container-low`). Components use Tailwind utilities mapped to those tokens so the Stitch palette stays consistent.

- **Display / headlines**: Plus Jakarta Sans (`--font-display`)
- **Body**: Inter (`--font-sans`)
- **Utilities**: `font-headline`, `font-body` (aliases in theme)

---

## Navigation architecture

- **Marketing pages** use `Navbar` + `Footer` (logo, explore links, login, post CTA).
- **`/dashboard/*`** uses `StudentAppShell`: fixed **desktop sidebar** + **mobile pill nav** + slim **app footer**.
- **`/employer/*`** uses `EmployerAppShell`: same sidebar contract + **mobile pill nav** (no bulky footer so messages/applicants can use vertical space).

Changing spacing or chrome once in the shell updates every page in that section.

---

## Finding every route

During development, open **`/dev/pages`** for a linked checklist of routes. The marketing footer also includes an **“All routes”** link for quick access.

---

## Adding a new page

1. Create `app/your-route/page.tsx`.
2. If it belongs to the student console, nest it under `app/dashboard/` so it picks up `dashboard/layout.tsx`. Same idea for `app/employer/`.
3. Add the path to `app/dev/pages/page.tsx` so the index stays complete.
4. If it is a primary destination, add a link in `Navbar`, `Sidebar`, or `Footer` as appropriate.

---

## Deploying

The app is a standard Next.js deployment:

- **Vercel**: connect the repo, set root directory to `frontend`, use default Next.js settings.
- **Docker / Node host**: run `npm run build` and `npm start` from `frontend`, or use an official Next.js Docker pattern.

Enable **image domains** in `next.config` if you move remote images to your own CDN.

---

## Roadmap (suggested)

1. **Auth** — sessions, protected `/dashboard` and `/employer` layouts, role-based redirects.
2. **API** — REST or tRPC; replace mock data in listing/detail pages.
3. **Database** — Postgres + Prisma/Drizzle; migrations in CI.
4. **Search** — server-side filters; URL-driven state on `/browse` and `/listings`.
5. **Real-time** — employer messages with WebSockets or a managed chat provider.
6. **i18n** — FR/EN toggle already hinted in footer copy.

---

## Contributing

1. Keep changes **scoped** to the feature (avoid drive-by refactors).
2. Run **`npm run build`** before opening a PR.
3. Match existing **Tailwind + naming** conventions in touched files.
4. Update **`/dev/pages`** if you add user-facing routes.

---

## License

Specify your license here when you publish the repo (e.g. MIT, Apache-2.0, or proprietary).

---

## Acknowledgments

UI patterns and copy draw from curated “Stitch” style exports in `stitch_assets/`. The running app is implemented in React/Next.js with a unified shell so those designs ship as one product—not a folder of disconnected HTML files.

**Built for Cameroon-first talent and employers—designed to scale beyond.**
