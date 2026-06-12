# InternBeacon — Complete Feature & Technology Inventory (Thesis Source Document)

Everything implemented in the platform as of 2026-06-12, verified against the actual code —
plus the list of what the thesis still needs. Use this to write Chapters 2, 4, and 5.

---

## 1. Technology Stack (Chapter 3/4 — Tools & Technologies table)

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 19.0 | UI component library |
| Vite | 6.0 | Build tool & dev server (port 5173) |
| React Router DOM | 6.28 | Client-side routing |
| TanStack Query (React Query) | 5.62 | Server-state management, caching, refetching |
| Axios | 1.7 | HTTP client with auth interceptors & silent token refresh |
| Socket.IO Client | 4.8 | Real-time WebSocket connection |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11.15 | Animations & transitions |
| Recharts | 2.14 | Analytics charts (bar, line, donut) |
| React Hook Form | 7.54 | Form state & validation |
| React Hot Toast | 2.4 | Toast notifications |
| React Easy Crop | 5.5 | Avatar/logo image cropping |
| Lucide React | 0.468 | Icon set |

### Backend
| Technology | Version | Role |
|---|---|---|
| Node.js + Express | Express 4.22 | REST API server (port 5000) |
| Socket.IO | 4.8 | Real-time layer (shares HTTP server) |
| Supabase JS (`@supabase/supabase-js`) | 2.107 | Database, Auth, and Storage client (service role) |
| Helmet | 8.2 | Security HTTP headers |
| CORS | 2.8 | Cross-origin policy |
| express-rate-limit | 7.5 | API rate limiting |
| express-validator | 7.3 | Request validation middleware |
| Multer | 1.4 | Multipart upload handling (memory storage, no disk) |
| file-type | 22.0 | Real MIME detection via buffer inspection (anti-spoofing) |
| pdf-parse | 2.4 | CV text extraction from PDF |
| Nodemailer | 6.10 | SMTP email notifications |

### Platform & Infrastructure
| Technology | Role |
|---|---|
| Supabase (PostgreSQL) | Managed Postgres (eu-west-3), Auth, file Storage |
| Supabase Auth | Authentication — JWT access/refresh tokens, roles in `app_metadata` |
| Supabase Storage | 3 buckets: `cvs` (PDF, 5MB), `avatars` (2MB), `logos` (2MB) |
| AI providers | Google Gemini (primary), Groq (Llama 3.1), xAI (Grok) — fallback chain |

> Thesis note: the document correctly states PostgreSQL + Supabase. There is **no Prisma
> and no custom JWT** in the implementation — auth is delegated entirely to Supabase Auth
> and verified live on every request (`supabaseAdmin.auth.getUser(token)`).

---

## 2. Database Schema (Chapter 4 — Database Design / ERD)

11 tables + 3 storage buckets:

| Table | Purpose |
|---|---|
| `profiles` | Base user record linked to Supabase Auth user |
| `student_profiles` | Name, university, faculty, programme, study_year (1–5), skills[], languages[], bio, cv_url, avatar_url, ai_summary (JSON from CV parsing) |
| `company_profiles` | Company name, sector, city, description, logo_url, **is_verified** (admin-granted badge) |
| `internship_offers` | title, domain, description, requirements, required_skills[], location, duration_weeks, is_paid, stipend_amount/currency, openings, deadline, start_date, status (draft/open/closed), views_count |
| `applications` | offer_id, student_id, cover_letter, cv_snapshot_url, status, company notes, interview fields (date, type, location, link, notes) |
| `application_status_history` | Full audit trail of every status transition |
| `messages` | 1:1 chat scoped to an application thread |
| `notifications` | Persistent in-app notifications |
| `notification_preferences` | Per-student offer-alert opt-out + minimum match-score threshold |
| `offer_bookmarks` | Student saved offers |
| `ai_fallback_log` | Every AI-failure→algorithmic-fallback event (feature, reason, timestamps) — **reliability data for Chapter 4 findings** |

Key constraint: `internship_offers.company_id` → `company_profiles.id` (not the auth user id).
Access control is enforced in backend middleware (service role bypasses RLS).

---

## 3. Implemented Features by Module

### Module 1 — Authentication & Authorization
- Student/company registration, login, logout, forgot/reset password, complete-profile onboarding, OAuth callback page
- Supabase Auth tokens in localStorage; Axios interceptor auto-refreshes on 401 and fires a `token:refreshed` DOM event so the socket reconnects
- 3 roles (student / company / admin) stored server-side in `app_metadata`; `authenticate` + `authorize(role)` middleware on every protected route

### Module 2 — Student Profile
- Editable profile (skills, languages, programme, faculty, study year 1–5, bio, links)
- CV upload (PDF, 5MB) with **real MIME validation via buffer inspection**, avatar upload with cropping
- CV signed-URL access control: student sees own; company only with a shared application; admin always
- Notification preferences (offer alerts on/off + minimum match score threshold)

### Module 3 — Company Profile
- Editable profile + logo upload; public company page (`/companies/:id`, no auth)
- **Admin-granted verification badge** (ShieldCheck) shown on offer cards and profile

### Module 4 — Internship Offers
- Company: create / edit / delete, draft→open→closed lifecycle, duration 1–104 weeks, paid/stipend (XAF), openings, deadline, start date
- Student/public: browse with filters (domain, location, search, pagination), offer detail with view counter, bookmarks
- **Automatic expiry**: hourly background job closes offers past their deadline
- **Offer alerts**: when an offer is published, it is scored against every opted-in student's profile; students whose match score ≥ their threshold (default 50) get notified automatically

### Module 5 — Applications (extended lifecycle)
- Student: apply with cover letter + CV snapshot, track, withdraw, **accept/decline the internship offer** (`/respond`)
- Company: per-offer applicant list, private notes, status workflow:
  `pending → under_review → shortlisted → interview_scheduled → interview_completed → final_review → accepted / rejected`
  (student-side terminal states: `withdrawn`, `offer_accepted`, `offer_declined`)
- **Interview scheduling**: date, type (online/in-person), location, meeting link, notes — with a student Interview Center page
- Full status history (audit trail) per application
- Email notifications (Nodemailer) for new applications, status changes, interviews, offer responses — silently skipped if SMTP not configured

### Module 6 — Real-Time Status Tracking (Socket.IO)
- Auth in `io.use()` middleware (same live Supabase token verification as REST)
- Rooms: `user:{userId}` (private notifications) and `thread:{appId}` (chat)
- `notifier.js`: fire-and-forget helper — DB insert + socket emit, never throws

### Module 7 — Direct Chat
- 1:1 messaging per application thread, persisted before emit, unread counts, mark-as-read
- Access restricted to the two parties of the application

### Module 8 — Notifications
- Persistent in-app panel + unread badge, mark one/all read, delete
- 10+ typed notifications with emoji + deep links (shortlisted ⭐, interview scheduled 📅, etc.)
- Dual delivery: DB row (persistent) + Socket.IO push (instant) + optional email

### Module 9 — Admin Panel
- Platform stats + **trends endpoint** (time-series analytics)
- User management: list, view, activate/deactivate, change role, delete
- Offer moderation: list all, force status change, delete
- Applications oversight, **company verification toggle**, broadcast notifications

### Module 10 — AI Features (BEYOND original spec — must be added to the thesis)
- **CV parsing** (`POST /api/ai/parse-cv`): pdf-parse extracts text (8,000-char cap) → LLM returns structured JSON (skills, education, experience, languages, summary) → stored in `ai_summary`; auto-fills profile skills if the student listed fewer than 3
- **Student↔offer match scoring** (`GET /api/ai/match-offer/:offerId`): 0–100 score, verdict, strengths, gaps, actionable tip, per-factor breakdown → "Why this match?" popover UI
- **Applicant ranking** (`GET /api/ai/rank-applicants/:offerId`): up to 50 active applicants ranked best-to-worst with score + one-line reason
- **Personalised recommendations** (`GET /api/offers/recommended`): purely algorithmic (no AI call) — newest 60 open un-applied offers scored, top N returned with human-readable reasons

### Module 11 — Analytics
- Student analytics page, company analytics page, admin trends — built with Recharts
- AI-reliability donut fed by `ai_fallback_log`

---

## 4. Algorithms (Chapter 4 — the core technical content)

### 4.1 Hybrid AI Matching with Algorithmic Fallback

**Provider chain** (`aiProvider.js`): try in priority order, fall through on failure:
1. Google **Gemini** — 2.5 Flash → 2.0 Flash → 2.0 Flash Lite (model-level fallback within provider)
2. **Groq** — Llama 3.1 8B Instant
3. **xAI** — Grok Beta

If **all** providers fail (HTTP 503), the system transparently switches to the local
**algorithmic matcher** — the response shape is identical, so the frontend never branches;
a `method: 'ai' | 'algorithmic'` field records which engine answered. Every fallback event
is logged to `ai_fallback_log` (measured reliability — use as Chapter 4 findings data).

This is a **graceful-degradation / hybrid intelligence architecture**: AI when available,
deterministic scoring when not. Ideal thesis framing for the low-connectivity Cameroonian
context.

### 4.2 The Weighted Matching Algorithm (`fallbackMatcher.js`)

**Score formula:**

```
MatchScore = min(100, round(0.45·S + 0.25·D + 0.15·L + 0.15·G))
```

| Factor | Weight | Method |
|---|---|---|
| **S — Skills** | 45% | **Coverage scoring**: `matched required skills ÷ total required skills × 100`. Deliberately NOT Jaccard similarity — Jaccard divides by the union of both skill sets, penalising students with broad skills. Coverage answers the business question: *what fraction of the offer's requirements does the student meet?* Floor of 5 (never zero); neutral 50 if the offer lists no skills. |
| **D — Domain** | 25% | Taxonomy matching across **8 domains** (IT, Finance & Banking, Engineering, Telecommunications, Marketing & Sales, HR, Healthcare, Agriculture) with **bilingual EN/FR aliases** (e.g. "génie informatique" → IT). Programme matches → 100; faculty matches → 65; unknown domain → 30; no match → 15. Full-phrase matching only (no single-word shortcuts → avoids false positives). |
| **L — Study level** | 15% | Regex extraction of the required year from free-text requirements (EN + FR patterns: "final-year", "3ème année", "licence 3", "master"…). Meets requirement → 100; one year short → 70; two short → 40; else 20. |
| **G — Language** | 15% | Detects English/French requirements in offer text; assumes Cameroonian students cover at least one official language. No language requirement → 100. |

**Pre-processing — skill normalization**: ~30-entry alias dictionary applied before any
comparison ("JS" = "JavaScript" = "Javascript ES6"; "node.js" = "nodejs"; "postgres" =
"postgresql"; "UI/UX" = "ui-ux design"…).

**Verdict bands**: ≥75 Excellent Match · ≥55 Good Match · ≥35 Partial Match · <35 Low Match.

**Output**: score, verdict, strengths[], gaps[], tip, and a structured per-factor
`breakdown` (consumed by the "Why this match?" UI). Both the AI path and the algorithmic
path produce this same shape; if the AI returns a malformed breakdown, the deterministic
one is substituted.

### 4.3 Recommendation Algorithm
Candidate pool = 60 most-recent open offers minus already-applied → each scored with the
weighted algorithm → sorted by score → top N (default 6) returned with reasons
("Matches your Computer Science programme", "Matches React, Python skills",
"Suitable for Year 4 students").

### 4.4 Applicant Ranking
Company-side: up to 50 most-recent non-terminal applicants sent to the AI with offer
context → ranked JSON array. On AI failure: every applicant scored with the weighted
algorithm and sorted descending.

### 4.5 Offer-Alert Targeting
On offer publication: score the offer against **every** opted-in student profile;
notify those whose score ≥ their personal threshold (default 50). Push-based
matching — students are found by offers, not only the reverse.

### 4.6 Supporting Algorithms
- **JSON extraction** (`extractJSON`): strips LLM preamble/markdown before `JSON.parse` — defensive parsing of non-deterministic AI output
- **Offer expiry job**: hourly scan closing offers past deadline (two-query pattern due to a PostgREST update+join limitation)
- **CV parsing pipeline**: Storage download → pdf-parse text extraction → prompt-engineered structured extraction → profile enrichment

---

## 5. Security Measures (Chapter 4 — Non-functional requirements)

| Measure | Implementation |
|---|---|
| Authentication | Supabase Auth; live token verification per request (no local JWT trust) |
| Authorization | Role middleware on every protected route; roles set server-side only |
| Transport/headers | Helmet security headers, CORS allow-list |
| Rate limiting | express-rate-limit on all `/api` routes |
| Input validation | express-validator rule sets per endpoint |
| Upload safety | Memory-only storage, size caps, **magic-byte MIME inspection** (file-type), per-bucket restrictions |
| File access control | Signed URLs; CV visible only to owner, companies with a shared application, or admin |
| Error hygiene | Global handler hides stack traces in production |
| Socket security | Same auth middleware on WebSocket handshake |

---

## 6. What the Thesis Still Needs (gap list from the 2026-06-11 review)

### Blockers
1. **All 17 figures are `[ INSERT FIGURE X HERE ]` placeholders.** Need: 2 questionnaire
   charts, architecture diagram, use case diagram, class diagram, 3 sequence diagrams,
   activity diagram, ERD, 7 screenshots (login, student dashboard, browse offers,
   application tracking, chat, company dashboard, admin dashboard).
2. **Word count**: Chapters 1–5 ≈ 18,700 words vs 20,000 minimum (~1,300+ short).
3. **Scope contradiction**: §1.5/§1.7 say AI matching is out of scope and Ch5 Rec 1/11
   recommend it as future work — but it is fully implemented. Fix by adding:
   - **Ch1**: rewrite §1.5 scope + §1.7 limitation to include hybrid AI/algorithmic matching
   - **Ch2**: a subsection on recommender-system approaches (content-based matching,
     weighted scoring; cite RippleMatch as AI-matching precedent) + LLM-assisted parsing
   - **Ch4**: new subsections — *Matching Engine Design* (the §4 formula above),
     *AI Provider Architecture & Graceful Degradation*, *CV Parsing Pipeline*; findings
     from `ai_fallback_log` (AI vs algorithmic usage, reliability %)
   - **Ch5**: replace Recommendation 1 (AI matching = done) with e.g. collaborative
     filtering from application history, ML-trained weights, embeddings-based skill similarity
   - This addition alone plausibly covers the missing word count.

### Required fixes
4. Restyle 26 wrongly Heading2-styled items (Table 9 cells, captions of Tables 4/5/6/9,
   §3.6 body paragraph) → Normal/Caption, else they pollute the regenerated TOC.
5. Add **Annexes** (FICT order item 18): questionnaire instrument, interview guide,
   extra screenshots, key code listings (e.g. the matching algorithm).
6. Title page: replace "[Month, 2026]" with the real submission month.
7. Reword the one "marketplace" mention (problem elaboration) → "platform".

### Already compliant — don't touch
Times New Roman, 12pt body / 14pt headings, 1.5 spacing, justified text, full front
matter in correct order, 37 APA references (min 25), correct chapter structure,
PostgreSQL/Supabase consistency.
