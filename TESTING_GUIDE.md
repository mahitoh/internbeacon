# InternBeacon — Demo Data & Testing Guide

Everything below is seeded in the live Supabase database by `backend/scripts/seed-demo-data.js`.
Re-running the script is safe — it updates profiles and skips rows that already exist.

> **Password for EVERY seeded account:** `InternBeacon!Dev1`

---

## 1. Accounts

### Students

| Email | Name | Profile | Pipeline state |
|---|---|---|---|
| `brice.fotso@internbeacon.dev` | Brice Fotso | Y4 Software Engineering, ICT University — JS/React/Node/PostgreSQL, CV uploaded | 1 interview scheduled, 1 under review, 1 rejected |
| `aisha.bello@internbeacon.dev` | Aisha Bello | Y3 Computer Science, UY1 — Python/SQL/data, CV uploaded | 1 shortlisted, 1 submitted, 1 under review |
| `kevin.ngu@internbeacon.dev` | Kevin Ngu | Y4 Telecoms, UB — networking/Cisco, CV uploaded | 1 **accepted**, 1 withdrawn |
| `marie.essomba@internbeacon.dev` | Marie Essomba | Y3 Banking & Finance, ESSEC — Excel/finance, CV uploaded | 1 interview scheduled, 1 submitted, 1 rejected |

### Companies

| Email | Company | City / building | Verified | Offers |
|---|---|---|---|---|
| `paylink@internbeacon.dev` | PayLink Cameroon (Fintech) | Douala — Immeuble Hollando, Akwa | ✅ | 3 (backend, data, QA-closing-today) |
| `siliconmountain@internbeacon.dev` | Silicon Mountain Labs | Buea — Molyko | ✅ | 3 (React, Flutter, UI/UX) |
| `agrovision@internbeacon.dev` | AgroVision SARL (Agritech) | Yaoundé — Bastos | ✅ | 2 (agronomy field, GIS) |
| `saheltelecom@internbeacon.dev` | Sahel Telecom | Yaoundé — Av. Kennedy | ❌ | 2 (NOC, IT support) |
| `bluehealth@internbeacon.dev` | BlueHealth Africa | Douala — Bonapriso | ✅ | 2 (full-stack, health data) |
| `montfebe@internbeacon.dev` | Mont Fébé Finance | Yaoundé — Bd du 20 Mai | ✅ | 2 (credit analysis, digital banking) |
| `kribilogistics@internbeacon.dev` | Kribi Logistics Group | Douala — Bonanjo + Kribi port | ❌ | 2 (supply chain, fleet) |
| `limbecreative@internbeacon.dev` | Limbe Creative Hub | Limbe — Down Beach | ❌ | 2 (social media, video) |

The seeded offers cover **every taxonomy domain** (IT, Finance, Engineering, Telecom, Marketing, Healthcare, Agriculture), paid (40k–80k XAF) and unpaid, on-site/hybrid, deadlines from **closing today** to 40 days out.

---

## 2. The "how does this actually help a student" walkthrough

This is the flow to run first — it answers your fear directly. Log in as
**`brice.fotso@internbeacon.dev`**.

### Step 1 — Dashboard tells him what to do
- Recommended offers ranked by real match scores (his skills → backend/full-stack offers rank top).
- The **skill-gap nudge** under "Recommended For You" tells him which one skill to add to unlock more offers.

### Step 2 — He finds an offer with everything he needs to decide
Open **Browse Offers → "Backend Developer Intern (Payments API)"**. The offer answers every practical question a Cameroonian student has:
- **Where exactly:** Immeuble Hollando, 4th floor, Boulevard de la Liberté, Akwa — *"5 min walk from the Bonanjo shared-taxi line"*
- **Interview process:** HR call → 1h live coding → CTO chat
- **Documents for day one:** CNI, certificate of enrollment, 2 passport photos, MoMo number for the stipend
- **Money:** 75,000 XAF/month, 12 weeks, hybrid after month one

### Step 3 — "Why this match?" (explainable AI)
- Click **Check Match** on the offer, then **click the score** — the popover shows the four weighted factor bars, his matched skills as green chips and missing ones as gray chips, plus whether AI or the local algorithm scored it.

### Step 4 — He already has an interview, with the full logistics
Go to **My Applications → Backend Developer Intern**. The scheduled interview shows:
- **Date** (3 days from seed time), **in person**
- **Location:** *"Immeuble Hollando 4th floor … ask for Linda at reception"*
- **Notes:** what to bring (CNI, enrollment certificate, photos), dress code, interview format

That's the answer to "how does this help a student": location, building, documents, process, money — all in one place instead of scattered WhatsApp rumours.

### Step 5 — The other emotional states
- Log in as **`kevin.ngu@…`** → see an **accepted** application (Sahel Telecom NOC) with the company's note about badge processing and the casier judiciaire.
- Brice also has a **rejection** from Silicon Mountain Labs with a humane note ("reapply next cohort") — check that the UI handles it gracefully.

---

## 3. Company-side test plan

Log in as **`paylink@internbeacon.dev`** (it has the richest pipeline):

1. **Dashboard** — 3 offers, applicant counts, the QA offer shows it closes today.
2. **Applications** — Brice (interview_scheduled) and Aisha (shortlisted on the data role):
   - Open Brice's application → **view his CV inline** (real PDF, opens in the viewer modal).
   - His **recruiter notes** are pre-filled: internal note (private) + note to candidate.
   - The **interview form** is filled: in-person, address, documents list — edit it and check the student side updates.
3. **Rank applicants (AI)** — on the Backend offer, run ranking; with one applicant it's trivial, so also try `saheltelecom@…` or `montfebe@…`.
4. **Status changes** — move Aisha (`paylink` → Data Analyst offer) from shortlisted → interview_scheduled; log in as Aisha in a second browser window first and watch the **real-time notification** arrive.
5. **Messaging** — open the thread with Brice, send a message, confirm it lands live on his side.

## 4. Admin checks

Log in with your admin account:
- User list now has 12 companies / 6+ students — test search, filters, the **verification toggle** (Sahel Telecom, Kribi Logistics and Limbe Creative are unverified — verify one and check the badge appears on its offers).
- Platform Activity chart should show today's signup spike.

## 5. Feature-by-feature checklist

| Feature | How to test with seeded data |
|---|---|
| Search & filters | Search "React", "credit", "NOC"; filter by Douala / Yaoundé / Buea / Limbe |
| Deadline chips | "QA & Testing Intern" closes **today**; "Fleet Maintenance" in 2 days; "IT Support" in 7 |
| AI match + fallback | Check Match on any offer; to force the fallback, stop the backend, blank `GEMINI_API_KEY`/`GROQ_API_KEY`/`XAI_API_KEY` in `backend/.env`, restart — score still appears, labelled "Scored locally", and a row lands in `ai_fallback_log` |
| CV parse (AI analysis) | As any student → Profile → Analyze CV — the seeded PDFs are text-based and parse cleanly |
| CV viewer | As a company with a shared application → open candidate CV; as a student → view own CV |
| Why-this-match popover | Click any match score chip (browse cards) or the big score number (offer detail) |
| Skill-gap nudge | Student dashboard, under Recommended — e.g. Brice is missing AWS/Flutter-type skills across offers |
| Interview details | Brice @ PayLink and Marie @ Mont Fébé — both in-person with building, contact person, documents |
| Verified badge | Verified: PayLink, SM Labs, AgroVision, BlueHealth, Mont Fébé. Unverified: the other three |
| Public company page | Open any company profile while logged out (`/companies/:id`) |
| Bookmarks | Save/unsave offers as any student |
| Withdrawn state | Kevin → IT Support application |

## 6. Re-seeding / cleanup

```bash
cd backend
node scripts/seed-demo-data.js     # safe to re-run any time
```

To wipe the demo accounts later, delete the `@internbeacon.dev` users in Supabase Auth — profiles, offers and applications cascade.
