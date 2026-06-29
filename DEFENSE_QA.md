# InternBeacon — Thesis Defense Q&A

> Jury-style questions with answers and code snippets. Organised from "tell me about your project" down to the hard, specific questions a panel will probe. Everything below is grounded in the actual code.

---

## 0. The 60-second pitch (have this memorised)

> InternBeacon is a full-stack internship matching platform connecting Cameroonian university students with companies. A student builds a profile (skills, programme, study year, languages, location) and uploads a CV; companies post internship offers. The **core contribution is a deterministic, explainable 5-factor matching engine** that scores every student–offer pair from 0–100 with a human-readable verdict and a breakdown of strengths and gaps. AI is used **only** to parse text out of CVs — never to decide a match. The stack is React + Vite on the front end, Node.js + Express on the back end, Supabase (PostgreSQL + Auth + Storage) as the backend-as-a-service, and Socket.IO for real-time notifications and messaging.

**The single most important sentence for your defense:** *"Matching, ranking and recommendations are 100% algorithmic and deterministic — the AI/LLM is used only to extract text and skills from an uploaded CV."* Say this early; it pre-empts half the hard questions.

---

## 1. High-level architecture

**Q: Walk me through your architecture.**

A: Three tiers:
1. **Frontend** — React 18 + Vite SPA. TanStack Query v5 manages all server state; a single Axios instance (`frontend/src/api/axios.js`) attaches the auth token and auto-refreshes on 401. Socket.IO client keeps a live connection for notifications/chat.
2. **Backend** — Express REST API. Every request flows through a fixed middleware pipeline. The backend holds the Supabase **service-role key**, so it bypasses Row-Level Security and enforces *all* access control itself in middleware + controllers.
3. **Data / platform** — Supabase: PostgreSQL database, Supabase Auth (no custom JWT), and Storage buckets for CVs, avatars and logos.

**Q: What is the request lifecycle on the backend?**

```
request → helmet (security headers) → cors → body-parse (100kb cap)
→ health-check (exempt) → rate limiter → route
→ authenticate → authorize(role) → validate (express-validator)
→ controller → supabaseAdmin → response
```

From `backend/src/app.js` — note the layered limiters and the global error handler that hides internals in production:

```js
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '100kb' }));

const generalLimiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
const authLimiter    = rateLimit({ windowMs: 15*60*1000, max: 20 }); // brute-force guard

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter); // stricter on auth

// Global error handler — leaks nothing in production
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'An unexpected error occurred',
  });
});
```

**Why this matters to a jury:** it shows defense-in-depth (rate limiting tiered by sensitivity, error-detail hiding, payload size caps, security headers) without you having had to hand-roll auth.

---

## 2. The Matching Engine — the heart of the thesis

This is where 70% of your questions will land. Know this file (`backend/src/utils/matchingEngine.js`) cold.

### 2.1 Why algorithmic and not AI?

**Q: Why didn't you just ask an LLM "how well does this student fit this job"?**

A: Four reasons, all defensible:
1. **Determinism / reproducibility** — the same inputs always produce the same score. A thesis result must be reproducible; an LLM's output can drift between calls and model versions.
2. **Explainability** — every point is traceable to a factor (skills, domain, location, level, language). I can show *why* a score is 78, not just assert it. This aligns with my thesis Chapter 4.
3. **Cost & availability** — scoring runs on every offer listing for every logged-in student. Doing that with an LLM would be slow and expensive; the algorithm is free and instant.
4. **No hallucination / fairness** — an LLM could invent skills or be biased by phrasing. My engine only credits skills the student actually listed.

```js
// computeMatch always returns method: 'algorithmic' — a guarantee, not a default
return { score, verdict, warning, strengths, gaps, tip, breakdown, method: 'algorithmic' };
```

### 2.2 The 5-factor weighted model

**Q: Explain your scoring formula.**

A: Five weighted factors summing to 1.0:

| Factor | Weight | What it measures |
|--------|--------|------------------|
| Skills | 35% | matched required skills ÷ total required skills (after alias normalization) |
| Domain | 30% | taxonomy match between student programme and offer domain |
| Location | 15% | city / region / remote proximity within Cameroon |
| Study level | 15% | student's study year vs. seniority parsed from requirements |
| Language | 5% | required languages vs. student's languages |

```js
const WEIGHTS = { skills: 0.35, domain: 0.30, location: 0.15, level: 0.15, language: 0.05 };

const rawScore = Math.min(100, Math.round(
  sk.score * effectiveWeights.skills +
  dsValue  * effectiveWeights.domain +
  lcValue  * effectiveWeights.location +
  ls       * effectiveWeights.level +
  lg       * effectiveWeights.language
));
```

**Q: How did you choose those weights?**

A: Skills are the strongest predictor of internship fit, so they get the largest single weight (35%). Domain/programme alignment is next (30%) because an accounting student is a poor fit for a software role regardless of incidental skills. Location and study level are practical filters (15% each) — a first-year in the wrong city *can* still be a reasonable match but shouldn't dominate. Language is a small tie-breaker (5%) in a bilingual (English/French) country where most candidates speak the needed language anyway. The weights are a single source of truth in one constant, aligned with thesis Chapter 4, and easy to defend or tune.

### 2.3 Skills factor — normalization

**Q: A student writes "ReactJS" and the company writes "React". Do they match?**

A: Yes. Every skill passes through `normalizeSkill()` with a 40+ entry alias table before comparison, so surface variants collapse to one canonical token.

```js
const SKILL_ALIASES = {
  'reactjs': 'react', 'react.js': 'react',
  'node': 'nodejs', 'node.js': 'nodejs',
  'comptabilité': 'accounting', 'gestion': 'management', // bilingual FR/EN
  // ...
};
function normalizeSkill(s) {
  const cleaned = String(s || '').trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

function skillsCoverage(studentSkills, offerSkills) {
  const techSkills = (offerSkills || []).filter(s => !isLanguageToken(s)); // strip languages
  if (techSkills.length === 0) return { score: 30, matched: [], missing: [], noRequirements: true };
  const have = new Set((studentSkills || []).map(normalizeSkill).filter(Boolean));
  const matched = [], missing = [];
  for (const skill of techSkills)
    (have.has(normalizeSkill(skill)) ? matched : missing).push(skill);
  return { score: Math.max(5, Math.round((matched.length / techSkills.length) * 100)), matched, missing, noRequirements: false };
}
```

**Note two deliberate edge cases:**
- If a company typed a *language* ("French") into the required-skills field, `isLanguageToken()` strips it so it's scored as a language, never as a "missing technical skill."
- If the offer lists no skills, the factor returns `30` (low-information, not a free neutral 50) — the company gave us little to match on.

### 2.4 Domain factor — two-stage taxonomy

**Q: How do you match a study programme to a job domain when they're written in free text?**

A: Two stages. First `classifyProgramme()` maps the student's programme/faculty text to one of ~16 canonical **academic fields** (computer_science, finance, hr, law, health…). Then `DOMAIN_FIELD_MAP` cross-references that field against the offer's domain, scoring 1.0 (direct), 0.6–0.8 (related), or 0.0 (none).

```js
function classifyProgramme(text) {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  let bestField = null, bestLen = 0;
  for (const [field, keywords] of Object.entries(ACADEMIC_FIELDS)) {
    for (const k of keywords) {
      const exact = k === t;
      const substring = k.length >= 5 && t.includes(k); // length guard
      if ((exact || substring) && k.length > bestLen) { bestField = field; bestLen = k.length; }
    }
  }
  return bestField; // null if unrecognised — never penalise
}
```

**Q (sharp): Why the `k.length >= 5` guard and "longest match wins"?**

A: To kill false positives from substrings. The keyword `'it'` would otherwise match inside `'droit'` (French for *law*), and `'communication'` is a substring of `'telecommunications'`. Requiring substring keywords to be ≥5 chars and always preferring the **longest** matching keyword prevents a short, accidental hit from beating the correct, specific one. Same idea in `resolveDomainMap()` so "Finance & Banking" isn't hijacked by a bare "Finance" key.

### 2.5 The cleverest part — domain-unknown redistribution

**Q: What happens to a student whose programme you don't recognise? Do they get a zero on 30% of the score?**

A: **No — and this is a deliberate fairness mechanism.** When the programme or the offer domain can't be classified, that factor returns `null` (meaning "unknown"), not 0. `computeMatch` then **redistributes** half of that factor's weight onto skills and leaves the other half as a neutral 50 — so an unrecognised programme is never silently punished as if it were a *bad* match.

```js
const domainUnknown   = ds === null;
const locationUnknown = lc === null;
const dsValue = ds ?? 50;   // unknown → neutral midpoint, NOT zero
const lcValue = lc ?? 50;

const effectiveWeights = { ...WEIGHTS };
if (domainUnknown) {
  effectiveWeights.skills += WEIGHTS.domain * 0.5;  // half the weight moves to skills
  effectiveWeights.domain  = WEIGHTS.domain * 0.5;  // the other half stays neutral
}
if (locationUnknown) {
  effectiveWeights.skills  += WEIGHTS.location * 0.5;
  effectiveWeights.location = WEIGHTS.location * 0.5;
}
```

**Why this is a strong defense point:** it distinguishes "we don't know" from "this is a bad match." A naive system conflates missing data with a negative signal; mine doesn't. This is exactly the kind of nuance a jury rewards.

### 2.6 Location, study level, language

```js
// Location: remote=100, same city=100, same region=60, else 30, unknown=null
function locationScore(studentCity, offerLocation) {
  if (!offerLocation) return null;
  const loc = offerLocation.toLowerCase().trim();
  if (/remote|télétravail|en ligne|online|à distance/i.test(loc)) return 100;
  if (!studentCity) return null;
  const city = studentCity.toLowerCase().trim();
  if (city === loc || loc.includes(city) || city.includes(loc)) return 100;
  const sameRegion = CAMEROON_REGIONS.some(g => g.some(t => city.includes(t)) && g.some(t => loc.includes(t)));
  return sameRegion ? 60 : 30;
}
```
The `CAMEROON_REGIONS` table groups cities with their region names and English/French variants (e.g. `['buea','limbe','sud-ouest','southwest','sw']`) — domain knowledge specific to Cameroon, which is a nice "why this is localised, not a generic clone" talking point.

```js
// Study level: parse a minimum year out of the requirements text, then compare
function studyLevelScore(studentYear, requirements) {
  if (!studentYear) return 50;
  const req = (requirements || '').toLowerCase();
  const patterns = [
    { re: /final[- ]?year|master/i, min: 4 },
    { re: /3[eè]me|3rd[- ]?year|licence\s*3\b/i, min: 3 }, // Licence 3 = final bachelor yr
    { re: /bachelor|undergraduate/i, min: 2 },
  ];
  let required = 2;
  for (const { re, min } of patterns) if (re.test(req)) { required = min; break; }
  if (studentYear >= required)      return 100;
  if (studentYear === required - 1) return 70;
  if (studentYear === required - 2) return 40;
  return 20;
}
```

Language scoring prefers the structured `required_languages` field and only falls back to scanning prose for older offers — and it understands both English and French labels (`anglais`/`english`, `français`/`french`).

### 2.7 Blocking conditions — guardrails

**Q: Could one perfect factor hide a disqualifying flaw — e.g. a great-skills match for a student who's clearly too junior?**

A: No. After the weighted score, `applyBlockingConditions()` enforces hard rules that one strong factor can't paper over:

```js
function applyBlockingConditions(score, verdict, ls, lc, skillCoverage, offerHasRequiredSkills) {
  // Zero skill overlap against an offer that DOES list requirements → force Low
  if (skillCoverage === 0 && offerHasRequiredSkills)
    return { score, verdict: 'Low Match', warning: 'No skills matching this offer\'s requirements.' };
  // Hard study-year miss → cap at 64 and flag for review
  if (ls <= 40)
    return { score: Math.min(score, 64), verdict: 'Review Carefully', warning: 'Minimum study year you may not meet yet.' };
  // Clear location mismatch downgrades Excellent → Good (but null is never a mismatch)
  if (lc !== null && lc <= 30 && verdict === 'Excellent Match')
    return { score, verdict: 'Good Match', warning: 'Different city — relocation may be required.' };
  return { score, verdict, warning: null };
}
```

This is the "sanity layer": the weighted model produces a number, the blocking layer makes sure the *verdict* can't be misleading.

### 2.8 Worked example (be ready to compute one live)

**Q: Give me a concrete example.**

Student: skills `[React, Node.js, JavaScript]`, programme `Computer Science`, city `Douala`, year 3, languages `[English, French]`.
Offer: required_skills `[React, Node.js, MongoDB]`, domain `Information Technology`, location `Douala`, requirements "3rd year", required_languages `[English]`.

- **Skills**: matched React + Node.js = 2/3 → 67
- **Domain**: CS → Information Technology = 1.0 → 100
- **Location**: same city → 100
- **Level**: year 3 ≥ required 3 → 100
- **Language**: speaks English → 100

`raw = 67·0.35 + 100·0.30 + 100·0.15 + 100·0.15 + 100·0.05 = 23.45 + 30 + 15 + 15 + 5 = 88.45 ≈ 88` → **"Excellent Match"**, with a gap noted: "Missing: MongoDB". No blocking condition triggers. The breakdown returns matched/missing skill lists so the UI can explain it.

---

## 3. AI usage (the *only* AI in the system)

**Q: You said there's AI. Where exactly?**

A: One place only: `POST /api/ai/parse-cv`. It downloads the student's uploaded CV from storage, extracts raw text (`pdf-parse` for PDF, a DOCX extractor), sends ~8k chars to an LLM with a strict prompt asking for JSON (skills, education, experience, languages, summary), and writes the extracted **skills** and **languages** into the student's profile columns. That's it. The match endpoints (`match-offer`, `rank-applicants`, `match-applicant`) all delegate to `computeMatch` — pure algorithm.

**Q: What if the AI is down or returns garbage?**

A: It degrades gracefully to a deterministic keyword extractor — CV parsing never fully fails:

```js
let extracted = null, method = 'ai';
try {
  const { text } = await callAI(prompt, 1024);
  extracted = extractJSON(text);
} catch (aiErr) { /* swallow — fall through */ }

if (!extracted || !Array.isArray(extracted.skills) || extracted.skills.length === 0) {
  method = 'keyword';
  extracted = {
    skills:    extractSkillsFromText(cvText),     // regex vocab of ~80 known skills
    languages: extractLanguagesFromText(cvText),
    // ...
  };
}
```

`extractSkillsFromText` scans the CV against a curated `SKILL_VOCAB` regex table whose output names mirror how offers list `required_skills`, so they still match cleanly after normalization.

**Q: Why multiple AI providers?**

A: Resilience and cost. `aiProvider.js` tries providers in priority order — **Gemini → Groq → Grok** — returning the first success and throwing a 503 only if *all* fail. Each provider call is wrapped in a 30s timeout so one slow provider can't hang the request. Anthropic/OpenAI are coded but disabled (credits exhausted).

```js
async function callAI(prompt, maxTokens = 1024) {
  if (!PROVIDERS.length) { const e = new Error('No AI providers configured'); e.status = 503; throw e; }
  const failures = [];
  for (const provider of PROVIDERS) {
    try {
      const text = await withTimeout(provider.call(prompt, maxTokens), 30_000, provider.name);
      return { text, provider: provider.name };
    } catch (err) { failures.push(`${provider.name}: ${err.message}`); }
  }
  const combined = new Error(`All AI providers failed — ${failures.join(' | ')}`);
  combined.status = 503; throw combined;
}
```

**Q (trap): Does the AI-extracted summary feed the match?**

A: **No.** `ai_summary` is extraction/display metadata only. Matching reads **only** the curated `student_profiles.skills` column — the single source of truth. So if a student deletes a skill from their profile, it genuinely stops affecting their matches; the AI blob can't resurrect it. This was a deliberate design fix (the code comment explains it) and a great point to volunteer.

```js
// In computeMatch:
const studentSkills = student.skills || []; // NOT ai_summary.skills — deterministic, user-controlled
```

---

## 4. Authentication & security

**Q: How does authentication work? Did you write your own JWT logic?**

A: No custom auth — that's a deliberate security decision. I use **Supabase Auth** end to end:
1. Frontend gets `accessToken`/`refreshToken` from Supabase, stored in `localStorage`.
2. Every API call sends `Authorization: Bearer <accessToken>`.
3. The backend `authenticate` middleware calls `supabaseAdmin.auth.getUser(token)` — a live verification against Supabase — on every request, and sets `req.user = { userId, email, role }`.
4. On a 401 the Axios interceptor auto-refreshes the token and replays the request, then fires a `token:refreshed` event so the socket reconnects.

**Q: Why call Supabase on every request instead of verifying the JWT locally with the secret?**

A: Local verification with `SUPABASE_JWT_SECRET` would be faster but can't see *revocation* — a logged-out or banned user's token would still validate until expiry. Asking Supabase live means a revoked session is rejected immediately. I traded a little latency for correctness on access control. (The CLAUDE.md rule is explicit: never use the JWT secret, never build custom auth.)

**Q: Roles?**

A: Three — `student`, `company`, `admin` — stored in Supabase `app_metadata` (only settable server-side via the service role, so a user can't escalate their own role). `authorize(role)` middleware gates routes; controllers additionally check **resource ownership**, e.g. a company can only rank applicants for an offer it owns:

```js
const { data: offer } = await supabaseAdmin
  .from('internship_offers').select('...')
  .eq('id', offerId).eq('company_id', cp.id).single();   // ownership enforced in the query
if (!offer) return res.status(403).json({ success: false, message: 'Access denied' });
```

**Q: You use the service-role key, which bypasses Row-Level Security. Isn't that dangerous?**

A: It's a conscious trade-off. The service role bypasses RLS, so **every** access rule lives in backend middleware and controllers instead of the database. The upside is all authorization logic is in one auditable place in application code; the cost is that the backend must be careful never to leak the service key (it's server-only, never shipped to the client) and must check ownership on every query — which it does. The frontend uses the *anon* key only.

**Q: File upload security?**

A: Uploads go through Multer in memory (no disk writes). MIME type is validated by **inspecting the real file buffer** with `file-type`, not trusting the client-supplied `Content-Type` or extension. CVs are PDF-only, 5MB cap. CV download is gated: a student sees only their own CV; a company sees a student's CV only if a shared application exists; admins always. Application CVs are copied to an **immutable per-application snapshot** namespaced by the auth user id, so a later re-upload can't alter what a company already reviewed.

---

## 5. Database & data modelling

**Q: Describe your schema.**

A: PostgreSQL via Supabase. Key tables: `student_profiles`, `company_profiles`, `internship_offers`, `applications`, `application_status_history`, `messages`, `notifications`, `bookmarks`. A few deliberate decisions:

- **`internship_offers.company_id` references `company_profiles.id`, not the auth user id** — so controllers always resolve the company profile first, then the offer. This is a common bug source I guarded against.
- **`study_year` has a DB CHECK (1–5)** and the backend re-validates before the call — belt and suspenders.
- **`application_status_history`** records every status transition (who, when, notes) — an audit trail, written fire-and-forget so a history failure never blocks the main update.
- **`profile_snapshot`** is stored on each application — an immutable copy of the student's profile *at apply time*, so the company always sees what was actually submitted even if the student later edits their profile.

```js
// Snapshot taken at apply time — immutable record of who applied with what
const profileSnapshot = fullProfile ? {
  firstName: fullProfile.first_name, programme: fullProfile.programme,
  studyYear: fullProfile.study_year, skills: fullProfile.skills,
  snapshotAt: new Date().toISOString(), /* ... */
} : null;
```

**Q: camelCase vs snake_case?**

A: The DB uses `snake_case`, the frontend uses `camelCase`. `profilesController.js` has `normalise*` helpers and other controllers map inline (see `normaliseApplication`). All API responses share one shape: `{ success, data }` or `{ success: false, message }`.

---

## 6. Application lifecycle & real-time

**Q: Walk through what happens when a student applies.**

A: `POST /api/applications`:
1. Validate the offer is `open`, before deadline, and not already full (`filled_count < openings`).
2. Insert the application with a `profile_snapshot`; a unique constraint (`23505`) returns a clean 409 if they already applied.
3. Asynchronously copy the CV to an immutable snapshot path (fire-and-forget — a copy failure can't block submission).
4. Write a status-history row.
5. Notify the company in two channels: an in-app notification (DB row + Socket.IO emit) **and** an email — both fire-and-forget so they never throw into the request.

**Q: Status flow?**

A: `submitted → under_review → shortlisted → interview_scheduled → interview_completed → final_review → accepted/rejected`, then the student responds `offer_accepted`/`offer_declined`. Terminal states are guarded — you can't update or withdraw a finalised application. Accepting can't exceed `openings`; on `offer_accepted` two RPCs run: `increment_offer_filled_count` and `close_offer_if_filled`.

**Q: Interviews — do you host video calls?**

A: No. Interviews are **scheduled, not hosted** — the company attaches a date, a type (`google_meet`/`zoom`/`teams`/`in_person`/`phone`), an optional external link, and notes; the student is notified instantly. I deliberately scoped out building a video stack. (Link inputs are normalised to absolute URLs so the SPA doesn't try to route them internally.)

**Q: Real-time?**

A: Socket.IO shares the HTTP server. Auth in `io.use()` uses the same `supabaseAdmin.auth.getUser` pattern. Two room types: `user:{userId}` for private notifications, `thread:{appId}` for the per-application chat between a student and company. `notifier.js` wraps DB-insert + socket-emit as a fire-and-forget helper used across controllers.

---

## 7. Likely "gotcha" questions — quick-fire answers

**Q: What's the single biggest weakness of your matching engine?**
A: It depends on the quality of the structured inputs — if a company writes a vague offer with no required skills, the skills factor degrades to a low-information default. I mitigate this (skills→30 not 50, domain redistribution) but garbage-in still limits precision. A future improvement is encouraging structured offer authoring.

**Q: Is the engine biased?**
A: It can only credit what the student explicitly listed, so it won't hallucinate or infer protected attributes (it never sees gender, age, ethnicity). The main fairness risk is the alias/vocab tables being incomplete for niche skills — which is why unknown programmes get neutral treatment, not a penalty.

**Q: How would you validate the engine empirically?**
A: Compare its rankings against recruiter judgements on a labelled set (precision@k, NDCG), and run ablation — drop one factor at a time and measure ranking change. The deterministic design makes this straightforward; an LLM-based scorer would be far harder to evaluate reproducibly. There's a unit test at `backend/tests/unit/matchingEngine/computeMatch.test.js`.

**Q: Why Supabase instead of your own Postgres + Prisma (your thesis mentioned that stack)?**
A: Supabase gave me managed Auth, Storage and Postgres in one place, which let me spend my time on the matching engine — the actual research contribution — rather than on auth plumbing. The trade-off is vendor coupling and the service-role/RLS decision discussed above.

**Q: What scales badly?**
A: `authenticate` makes a network call to Supabase per request — fine at thesis scale, but at high traffic I'd cache validated tokens for a few seconds or move to local JWT verification with a revocation list. Match scoring is O(skills) per pair and trivially cheap.

**Q: What would you add with more time?**
A: Saved-search alerts (the `offerAlerts` scaffold already scores new offers against opted-in students at publish time), recruiter analytics, and an empirical evaluation of the weights against real placement outcomes.

**Q: Why is `method` always `'algorithmic'` in the response — what's the point?**
A: It's an explicit, machine-readable guarantee to the frontend (and to any reviewer) that no AI influenced this score. It documents the architectural boundary in the data itself.

---

## 8. One-line answers to "what does this file do?"

| File | Responsibility |
|------|----------------|
| `matchingEngine.js` | The 5-factor deterministic scoring model — the thesis core. Exports `computeMatch`, `computeRecommendationReasons`, `getVerdict`, `normalizeSkill`. |
| `aiProvider.js` | Multi-provider LLM caller (Gemini→Groq→Grok) with per-provider timeouts; the only file that talks to an LLM. |
| `aiController.js` | CV parsing (the only `callAI` use) + algorithmic match/rank endpoints that delegate to the engine. |
| `applicationsController.js` | Full application lifecycle: apply, status transitions, withdraw, offer response, notes, history, profile snapshots. |
| `offersController.js` | Offer CRUD + attaches inline `match` scores for logged-in students; `recommended` feed. |
| `uploadController.js` | Memory uploads, real-buffer MIME validation, gated CV signed URLs. |
| `app.js` | Express pipeline: helmet, CORS, tiered rate limits, routes, production-safe error handler. |
| `socket/index.js` | Socket.IO auth + `user:` / `thread:` rooms; `emitNotification`/`emitNewMessage`. |
| `notifier.js` | Fire-and-forget DB-insert + socket-emit helper; never throws. |
| `expiry.js` | Hourly job closing offers past their deadline. |
| `authenticate.js` / `authenticateOptional.js` | Live Supabase token verification; optional variant powers public listings with inline match for logged-in users. |

---

### Final tip for the room
When asked anything about scoring, **always return to the breakdown**: "the engine doesn't just output a number, it outputs *why* — matched skills, missing skills, domain alignment, the verdict, and a tip." Explainability is your strongest card; play it often.
