# Tests

Automated tests for the InternBeacon backend, focused on the **deterministic
matching engine** — the algorithmic core of the platform (thesis Chapter 4).

The suite uses Node's **built-in test runner** (`node:test`) and `node:assert`.
There are **no extra dependencies** and **no network / database / AI calls** —
every test exercises pure functions, so the suite is fast and reproducible.

## Running

From the `backend/` directory:

```bash
npm test            # run everything once
npm run test:watch  # re-run on file change
```

Run a single file directly:

```bash
node --test tests/unit/matchingEngine/computeMatch.test.js
```

## Layout

```
tests/
├── helpers/
│   └── fixtures.js                     # student / offer builders (makeStudent, makeOffer)
└── unit/
    ├── matchingEngine/
    │   ├── normalizeSkill.test.js      # alias normalization (reactjs→react, comptabilité→accounting…)
    │   ├── getVerdict.test.js          # 85/70/50 verdict thresholds + boundaries
    │   ├── computeMatch.test.js        # 5-factor scoring, blocking conditions, redistribution, determinism
    │   ├── recommendations.test.js     # computeRecommendationReasons output
    │   └── cvExtraction.test.js        # no-AI keyword skill/language extraction
    └── utils/
        └── aiProvider.test.js          # extractJSON — strips LLM preamble before JSON.parse
```

## What is covered

| Area | Asserts |
|------|---------|
| **Weighting** | full / partial / zero skill coverage; domain alignment; location; study level; language |
| **Blocking conditions** | zero-skill → `Low Match`; hard study-year miss → `Review Carefully` (score ≤ 64); location mismatch downgrades `Excellent` → `Good` |
| **Domain-unknown redistribution** | unrecognized programmes are marked `unknown` and given a neutral 0.5, never penalized to 0 |
| **Contract** | `computeMatch` always returns `{ score, verdict, warning, strengths, gaps, tip, breakdown, method:'algorithmic' }`, score an integer in 0–100, factor scores in 0–1 |
| **Determinism** | identical inputs → identical output (no AI, no randomness) |
| **CV fallback** | `extractSkillsFromText` / `extractLanguagesFromText` pull canonical names and don't hallucinate |

## Adding tests

Mirror the source layout under `tests/unit/`, name files `*.test.js`, and reuse
`helpers/fixtures.js` for the student/offer shapes.
