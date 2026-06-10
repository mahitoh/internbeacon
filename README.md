<div align="center">

# 🔦 InternBeacon

### An AI-Powered Internship Matching Platform for Cameroonian University Students

*Connecting students with companies — intelligently, in real time.*

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## Overview

**InternBeacon** is a full-stack web platform that bridges the gap between Cameroonian university students and companies offering internships. Students can discover opportunities, apply with their CVs, track every stage of their application in real time, and communicate directly with recruiters — all in one place.

Built as a final-year engineering project, InternBeacon goes beyond a simple job board. It incorporates **AI-powered CV parsing**, **intelligent offer matching**, **multi-provider AI applicant ranking**, and a **fully audited application lifecycle** — the kind of features found in professional ATS platforms.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Real-Time Events](#real-time-events)
- [AI Features](#ai-features)
- [Application Lifecycle](#application-lifecycle)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

---

## Features

### For Students
- **Browse & Discover** — Search and filter internship offers by domain, location, and type
- **Recommended Offers** — Personalised offer feed ranked by algorithmic compatibility with your profile
- **Smart Apply** — Submit applications with CV upload; CV is auto-populated from your profile if none is attached
- **Real-Time Status Tracking** — Follow your application through an 8-stage pipeline with a visual timeline
- **Accept or Decline Offers** — Close the loop when a company accepts you
- **Direct Messaging** — Chat with recruiters in real time, tied to each application
- **AI Offer Matching** — Get a compatibility score (0–100) between your profile and any offer
- **AI CV Parser** — Upload a PDF CV and let Claude extract your skills, education, and experience automatically
- **Profile Completion Score** — Visual indicator showing how complete your profile is
- **Bookmark Offers** — Save interesting offers for later
- **Analytics Dashboard** — View your application funnel, conversion rates, and activity stats

### For Companies
- **Post & Manage Offers** — Create internship listings with full details, deadlines, and requirements
- **Application Pipeline** — Move candidates through a structured review workflow
- **Interview Scheduling** — Attach interview dates, type (Google Meet, Zoom, Teams, in-person, phone), links, and notes to any application
- **Internal Notes** — Private recruiter notes per candidate, never visible to students
- **AI Applicant Ranking** — Rank all applicants for an offer by compatibility score using Claude
- **Direct Messaging** — Communicate with candidates in real time
- **Company Verification Badge** — Admin-granted verified status shown on your profile and offer cards
- **Analytics Dashboard** — Track offer performance, application volume, and hiring funnel

### For Admins
- **User Management** — Activate, deactivate, change roles, or delete any user
- **Offer Moderation** — Review, approve, or remove any listed offer
- **Application Oversight** — View all applications across the platform
- **Company Verification** — Toggle verified status for company profiles
- **Broadcast Notifications** — Send platform-wide announcements to all users
- **System Statistics** — Platform-wide metrics dashboard

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 20 + Express.js 4** | REST API server |
| **Supabase (PostgreSQL 16)** | Database, Auth, and File Storage |
| **Socket.IO 4** | Real-time messaging and notifications |
| **Anthropic Claude API** | AI CV parsing, offer matching, applicant ranking |
| **Nodemailer** | Transactional email (status updates, interview invites) |
| **Multer + file-type** | Secure file uploads with MIME validation |
| **Helmet + express-rate-limit** | Security headers and request rate limiting |
| **express-validator** | Input validation and sanitization |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + Vite 6** | UI library and build tool |
| **React Router v6** | Client-side routing with role-based guards |
| **TanStack Query v5** | Server state management and caching |
| **Axios** | HTTP client with JWT interceptors and auto-refresh |
| **Socket.IO Client** | Real-time WebSocket connection |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **Recharts** | Analytics charts and data visualization |
| **React Hook Form** | Form state management and validation |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│   React SPA (Vite)                                          │
│   ├── React Router    (role-based routing)                  │
│   ├── TanStack Query  (server state + cache)                │
│   ├── Axios           (REST API calls + JWT interceptor)    │
│   └── Socket.IO       (real-time events)                    │
└──────────────┬──────────────────────┬───────────────────────┘
               │ HTTP/REST            │ WebSocket
               ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server (Node.js)                  │
│                                                             │
│   Middleware Stack                                          │
│   ├── Helmet          (security headers)                    │
│   ├── CORS            (origin allowlist)                    │
│   ├── Rate Limiter    (100 req/15min general)               │
│   ├── authenticate    (Supabase JWT verification)           │
│   └── authorize       (role-based access control)           │
│                                                             │
│   Route Modules                                             │
│   auth / offers / applications / messages /                 │
│   profiles / notifications / upload / ai /                  │
│   analytics / admin                                         │
│                                                             │
│   Socket.IO Server                                          │
│   ├── user:{userId}   (private notifications)               │
│   └── thread:{appId}  (application messaging)               │
│                                                             │
│   Background Jobs                                           │
│   └── Offer Expiry    (hourly cron — closes past deadline)  │
└──────────────┬──────────────────────┬───────────────────────┘
               │ Supabase Client      │ AI Providers
               ▼                      ▼
┌─────────────────────┐  ┌────────────────────────────────────┐
│   Supabase           │  │  AI Fallback Chain                 │
│   ├── PostgreSQL 16  │  │  1. Google Gemini (primary)        │
│   ├── Auth (JWT)     │  │  2. Groq                           │
│   └── Storage        │  │  3. xAI Grok                       │
│       ├── cvs        │  │  4. Algorithmic fallback (local)   │
│       ├── avatars    │  │     (Jaccard + domain + level)     │
│       └── logos      │  └────────────────────────────────────┘
└─────────────────────┘
```

### Key Design Decisions

- **Auth via Supabase only** — No custom JWT signing. Every request verifies the token live via `supabaseAdmin.auth.getUser()`, ensuring tokens cannot be forged or replayed after invalidation.
- **RLS bypassed server-side** — The backend uses the service role key, so all authorization is enforced in Express middleware rather than database policies.
- **Socket rooms** — Two room types: `user:{userId}` for private notifications, `thread:{appId}` for shared application messaging between student and company.
- **AI fallback chain** — Active priority is Gemini → Groq → Grok. If all AI providers are unavailable, the algorithmic fallback (`fallbackMatcher.js`) computes scores locally with no external calls.
- **Uniform response shape** — All API responses follow `{ success: true, data: {...} }` or `{ success: false, message: '...' }`.
- **snake_case ↔ camelCase** — Database uses snake_case; frontend uses camelCase. Controllers normalize all outgoing data.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project (free tier works)
- At least one AI provider API key (Anthropic recommended)
- Gmail account with App Password for email (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/internbeacon.git
cd internbeacon

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running in Development

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

### Production Build

```bash
# Build the frontend
cd frontend
npm run build

# Start the backend
cd ../backend
npm start
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# ── Server ────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ── Supabase ──────────────────────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# ── File Uploads ──────────────────────────────────────────────
UPLOAD_DIR=./uploads
MAX_CV_SIZE_MB=5
MAX_LOGO_SIZE_MB=2

# ── Email (Nodemailer) ────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# ── AI Providers (fallback chain) ─────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...   # optional
GEMINI_API_KEY=...           # optional
GROQ_API_KEY=...             # optional
XAI_API_KEY=xai-...          # optional
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## API Reference

> All protected routes require an `Authorization: Bearer <token>` header.
> All responses follow `{ success: boolean, data?: any, message?: string }`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a student or company account |
| POST | `/api/auth/login` | — | Login and receive access + refresh tokens |
| POST | `/api/auth/refresh` | — | Exchange refresh token for new access token |
| POST | `/api/auth/forgot-password` | — | Request a password reset email |
| POST | `/api/auth/reset-password` | — | Complete password reset with token |
| POST | `/api/auth/logout` | ✓ | Invalidate session |
| GET | `/api/auth/me` | ✓ | Get current authenticated user |
| POST | `/api/auth/complete-profile` | ✓ | Complete onboarding after registration |

### Internship Offers

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/offers` | — | — | List all active offers (filterable) |
| GET | `/api/offers/:id` | — | — | Get single offer details |
| GET | `/api/offers/my` | ✓ | Company | Get company's own offers |
| POST | `/api/offers` | ✓ | Company | Create a new internship offer |
| PATCH | `/api/offers/:id` | ✓ | Company | Update an offer |
| DELETE | `/api/offers/:id` | ✓ | Company | Delete an offer |
| GET | `/api/offers/recommended` | ✓ | Student | Get algorithmically ranked recommended offers |
| GET | `/api/offers/bookmarks` | ✓ | Student | Get bookmarked offers |
| POST | `/api/offers/:id/bookmark` | ✓ | Student | Bookmark an offer |
| DELETE | `/api/offers/:id/bookmark` | ✓ | Student | Remove bookmark |

### Companies

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/companies/:id` | — | Get public company profile (no auth required) |

### Applications

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/applications` | ✓ | Student | Submit an application |
| GET | `/api/applications/my` | ✓ | Student | Get all student applications |
| PATCH | `/api/applications/:id/withdraw` | ✓ | Student | Withdraw an application |
| PATCH | `/api/applications/:id/respond` | ✓ | Student | Accept or decline an offer |
| GET | `/api/applications/company` | ✓ | Company | Get all received applications |
| GET | `/api/applications/offer/:offerId` | ✓ | Company | Applications for a specific offer |
| PATCH | `/api/applications/:id/status` | ✓ | Company | Update application status |
| GET | `/api/applications/:id` | ✓ | Any | Get application details |
| GET | `/api/applications/:id/history` | ✓ | Any | Full status change audit trail |

### Messaging

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/messages/threads` | ✓ | List all message threads |
| GET | `/api/messages/app/:appId` | ✓ | Messages in a thread |
| POST | `/api/messages/app/:appId` | ✓ | Send a message |
| PATCH | `/api/messages/:id/read` | ✓ | Mark message as read |
| GET | `/api/messages/unread-count` | ✓ | Get unread message count |

### Profiles

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/profiles/student/:id` | ✓ | — | Get student profile |
| GET | `/api/profiles/company/:id` | ✓ | — | Get company profile |
| PATCH | `/api/profiles/student` | ✓ | Student | Update student profile |
| PATCH | `/api/profiles/company` | ✓ | Company | Update company profile |

### File Uploads

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/upload/cv` | ✓ | Student | Upload CV (PDF, max 5MB) |
| POST | `/api/upload/avatar` | ✓ | Student | Upload profile avatar (image, max 2MB) |
| POST | `/api/upload/logo` | ✓ | Company | Upload company logo (image, max 2MB) |
| GET | `/api/upload/cv-url/:studentId` | ✓ | Any | Get signed URL for a student's CV |

### AI

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/ai/providers` | ✓ | Any | List active AI providers |
| POST | `/api/ai/parse-cv` | ✓ | Student | Extract structured data from PDF CV |
| GET | `/api/ai/match-offer/:offerId` | ✓ | Student | Get compatibility score vs. an offer |
| GET | `/api/ai/rank-applicants/:offerId` | ✓ | Company | Rank all applicants for an offer |

### Analytics

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/analytics` | ✓ | Student | Student dashboard statistics |
| GET | `/api/analytics/company` | ✓ | Company | Company dashboard statistics |

### Admin

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/admin/stats` | ✓ | Admin | Platform-wide statistics |
| GET | `/api/admin/users` | ✓ | Admin | List all users |
| PATCH | `/api/admin/users/:id/activate` | ✓ | Admin | Activate or deactivate a user |
| PATCH | `/api/admin/users/:id/role` | ✓ | Admin | Change a user's role |
| DELETE | `/api/admin/users/:id` | ✓ | Admin | Delete a user |
| GET | `/api/admin/offers` | ✓ | Admin | List all offers |
| PATCH | `/api/admin/offers/:id/status` | ✓ | Admin | Change offer status |
| DELETE | `/api/admin/offers/:id` | ✓ | Admin | Delete an offer |
| GET | `/api/admin/applications` | ✓ | Admin | List all applications |
| PATCH | `/api/admin/companies/:id/verify` | ✓ | Admin | Toggle company verification |
| POST | `/api/admin/notifications/broadcast` | ✓ | Admin | Send broadcast notification |

---

## Real-Time Events

InternBeacon uses Socket.IO for live messaging and notifications. The server validates every connection via JWT before the socket is accepted.

### Connection

```javascript
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
  auth: { token: 'your_access_token' }
})
```

### Rooms

| Room | Members | Purpose |
|------|---------|---------|
| `user:{userId}` | Single user | Private notifications |
| `thread:{appId}` | Student + Company | Application messaging |

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_thread` | `appId: string` | Join an application's messaging room |
| `leave_thread` | `appId: string` | Leave an application's messaging room |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new_message` | Message object | New message in a thread you're in |
| `new_notification` | Notification object | New notification for your user |
| `messages_read` | `{ messageIds, readerId }` | Read receipt from the other party |
| `error` | `{ message: string }` | Authentication or authorization error |

---

## AI Features

InternBeacon integrates a **multi-provider AI fallback chain**. If the active provider fails or is rate-limited, the system automatically cascades to the next available one. If all external providers are unavailable, the local algorithmic engine takes over with no service interruption.

```
Google Gemini  →  Groq  →  xAI Grok  →  Algorithmic Fallback (local)
```

### CV Parser
Extracts text from a student's uploaded PDF CV using `pdf-parse`, then sends the content to Claude with a structured prompt. Returns a JSON object with skills, education history, work experience, languages, and a summary — ready to pre-fill the student's profile.

### Offer Matching
Compares a student's full profile (skills, education, experience) against an offer's requirements and returns a **compatibility score from 0–100** with a brief explanation. Students see this score on every offer card.

### Applicant Ranking
Given an offer ID, fetches all applicants and their profiles, sends the full set to the active AI provider in a single batch prompt, and returns a ranked list with scores and reasoning. Companies use this to prioritize which candidates to review first.

### Algorithmic Fallback
When all AI providers are unavailable, `fallbackMatcher.js` computes a compatibility score locally using a weighted formula: **40% skills** (Jaccard similarity) + **25% domain/programme** (taxonomy matching) + **20% study level** + **15% language**. The output shape is identical to the AI response, so the frontend requires no changes.

---

## Application Lifecycle

Every application follows a structured pipeline. Every status change is recorded in `application_status_history` with a timestamp, the user who made the change, and optional notes.

```
[Student]                          [Company]
   │                                   │
   ├─ submitted ──────────────────────►│
   │                                   ├─ under_review
   │                                   ├─ shortlisted
   │                                   ├─ interview_scheduled  ← date, type, link attached
   │                                   ├─ interview_completed
   │                                   ├─ final_review
   │                                   ├─ accepted
   │                                   └─ rejected
   │
   ├─ offer_accepted  ◄── (student responds to an accepted application)
   ├─ offer_declined  ◄── (student declines the accepted offer)
   └─ withdrawn       ◄── (student can withdraw at any stage)
```

Every transition triggers an email notification to the relevant party and a real-time in-app notification via Socket.IO.

---

## Project Structure

```
internbeacon/
│
├── backend/
│   ├── src/
│   │   ├── server.js              # Entry point — HTTP + Socket.IO init
│   │   ├── app.js                 # Express app, middleware, routes
│   │   ├── config/
│   │   │   ├── env.js             # Environment variable validation
│   │   │   └── supabase.js        # Supabase client setup
│   │   ├── middleware/
│   │   │   ├── authenticate.js    # JWT verification via Supabase
│   │   │   ├── authorize.js       # Role-based access control
│   │   │   └── validate.js        # express-validator integration
│   │   ├── routes/                # Route modules (12 files, incl. companies.js)
│   │   ├── controllers/           # Business logic (11 controllers)
│   │   ├── socket/
│   │   │   └── index.js           # Socket.IO server, rooms, events
│   │   └── utils/
│   │       ├── aiProvider.js      # Multi-provider AI fallback chain
│   │       ├── fallbackMatcher.js # Algorithmic match engine (Jaccard + domain)
│   │       ├── expiry.js          # Hourly offer expiry job
│   │       ├── mailer.js          # Email notifications
│   │       ├── notifier.js        # DB insert + Socket emit helper
│   │       └── validators.js      # Shared validation rule definitions
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx               # React entry point
    │   ├── App.jsx                # Routes and role-based guards
    │   ├── api/                   # Axios API modules (11 files)
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Global auth state
    │   │   ├── SocketContext.jsx  # Socket.IO connection management
    │   │   └── ThemeContext.jsx   # Dark / light mode
    │   ├── components/
    │   │   ├── layout/            # DashboardLayout, PublicLayout, etc.
    │   │   ├── ui/                # Reusable components (Button, Badge, etc.)
    │   │   ├── dashboard/         # StatCard, analytics widgets
    │   │   └── offers/            # OfferCard
    │   └── pages/
    │       ├── public/            # Landing, About, Browse, Pricing, CompanyPublicProfile
    │       ├── auth/              # Login, Register, Onboarding
    │       ├── student/           # Dashboard, Applications, Messages, Profile
    │       ├── company/           # Dashboard, Offers, Applications, Messaging
    │       ├── admin/             # Users, Offers, Applications management
    │       └── shared/            # Notifications
    ├── .env
    └── package.json
```

---

## Database Schema

### Core Tables

```sql
-- Users (managed by Supabase Auth)
profiles          (id, role, full_name, avatar_url, created_at)
student_profiles  (user_id, university, study_year, skills[], cv_url, bio, ...)
company_profiles  (user_id, company_name, industry, logo_url, verified, ...)

-- Offers
internship_offers (id, company_id, title, description, domain, location,
                   type, duration, deadline, status, created_at)

-- Applications
applications      (id, student_id, offer_id, status, cv_snapshot_url,
                   cover_letter, interview_date, interview_type,
                   interview_link, interview_location, interview_notes,
                   internal_note, created_at)

application_status_history (id, application_id, status, changed_by,
                             notes, created_at)

-- Messaging
messages          (id, application_id, sender_id, content, read_at, created_at)

-- Engagement
notifications     (id, user_id, type, title, body, read, created_at)
offer_bookmarks   (student_id, offer_id, created_at)
```

### Storage Buckets

| Bucket | Contents | Access |
|--------|----------|--------|
| `cvs` | Student CV PDFs | Signed URLs (authenticated only) |
| `avatars` | Student profile photos | Public |
| `logos` | Company logos | Public |

---

## Contributing

This is an academic project, but contributions and feedback are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<div align="center">

Built with care for Cameroonian students.

**InternBeacon** — *Light the way to your internship.*

</div>
