/**
 * Algorithmic match/recommendation engine.
 * Used when all AI providers fail, and for instant recommendations.
 *
 * Skills use COVERAGE (matched / required), not Jaccard — Jaccard divides by
 * the union, which penalizes students with broad skill sets. Coverage answers
 * the business question: what fraction of the offer's requirements are met?
 *
 * Output shape mirrors the AI response so the frontend needs no changes, plus
 * a structured `breakdown` consumed by the "Why this match?" UI.
 */

// ── Scoring weights — single source of truth, tune & justify here ─────────────

const WEIGHTS = {
  skills:   0.45,
  domain:   0.25,
  level:    0.15,
  language: 0.15,
};

// ── Skill normalization ───────────────────────────────────────────────────────
// Applied before ANY comparison so "JS" === "JavaScript" === "Javascript ES6".

const SKILL_ALIASES = {
  'js': 'javascript', 'javascript es6': 'javascript', 'es6': 'javascript',
  'reactjs': 'react', 'react.js': 'react', 'react js': 'react',
  'node': 'nodejs', 'node.js': 'nodejs', 'node js': 'nodejs',
  'postgres': 'postgresql', 'psql': 'postgresql',
  'py': 'python', 'python3': 'python',
  'html5': 'html', 'css3': 'css',
  'ms excel': 'excel', 'microsoft excel': 'excel',
  'ms word': 'word', 'microsoft word': 'word',
  'ts': 'typescript', 'type script': 'typescript',
  'tailwindcss': 'tailwind', 'tailwind css': 'tailwind',
  'expressjs': 'express', 'express.js': 'express',
  'vuejs': 'vue', 'vue.js': 'vue',
  'nextjs': 'next.js', 'next js': 'next.js',
  'c sharp': 'c#', 'csharp': 'c#',
  'golang': 'go',
  'ml': 'machine learning', 'ai': 'artificial intelligence',
  'db': 'databases', 'database': 'databases',
  'ui/ux': 'ui-ux design', 'ux/ui': 'ui-ux design', 'ui ux': 'ui-ux design',
};

function normalizeSkill(s) {
  const cleaned = String(s || '').trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

// ── Domain taxonomy ───────────────────────────────────────────────────────────

const DOMAIN_TAXONOMY = {
  'Information Technology': [
    'computer science', 'software engineering', 'information technology',
    'computer engineering', 'data science', 'cybersecurity', 'information systems',
    'computer networks', 'informatics', 'it', 'génie informatique', 'informatique',
  ],
  'Finance & Banking': [
    'accounting', 'finance', 'economics', 'business administration', 'management',
    'commerce', 'banking', 'comptabilité', 'gestion', 'économie',
  ],
  'Engineering': [
    'mechanical engineering', 'civil engineering', 'electrical engineering',
    'industrial engineering', 'environmental engineering', 'chemical engineering',
    'génie civil', 'génie mécanique', 'génie électrique',
  ],
  'Telecommunications': [
    'telecommunications', 'electronic engineering', 'network engineering',
    'computer networks', 'telecom', 'télécommunications', 'électronique',
  ],
  'Marketing & Sales': [
    'marketing', 'business administration', 'commerce', 'management',
    'communication', 'advertising', 'vente', 'commercial',
  ],
  'Human Resources': [
    'human resources', 'business administration', 'management', 'psychology',
    'sociology', 'hr', 'ressources humaines', 'gestion rh',
  ],
  'Healthcare': [
    'medicine', 'pharmacy', 'nursing', 'biomedical', 'public health',
    'médecine', 'pharmacie', 'santé',
  ],
  'Agriculture': [
    'agriculture', 'agronomy', 'environmental science', 'biology',
    'agronomie', 'biologie',
  ],
};

// ── Core scoring functions ────────────────────────────────────────────────────

/**
 * Coverage scoring: fraction of the offer's required skills the student has.
 * Returns { score: 0-100, matched: [...], missing: [...] } using the offer's
 * original skill labels (so the UI shows "Docker", not "docker").
 */
function skillsCoverage(studentSkills, offerSkills) {
  if (!offerSkills || offerSkills.length === 0) {
    return { score: 50, matched: [], missing: [] }; // neutral: no requirements specified
  }

  const have = new Set((studentSkills || []).map(normalizeSkill).filter(Boolean));
  const matched = [];
  const missing = [];
  for (const skill of offerSkills) {
    (have.has(normalizeSkill(skill)) ? matched : missing).push(skill);
  }

  const score = Math.round((matched.length / offerSkills.length) * 100);

  // Soften total mismatch — student still has a baseline score
  return { score: Math.max(score, 5), matched, missing };
}

function domainScore(programme, faculty, offerDomain) {
  if (!offerDomain) return 50;
  const domainLower = offerDomain.toLowerCase().trim();

  // Resolve the taxonomy bucket for this offer domain using exact key match first,
  // then full-phrase alias matching (no first-word shortcuts that cause false positives).
  let aliases = null;
  for (const [key, list] of Object.entries(DOMAIN_TAXONOMY)) {
    const keyLower = key.toLowerCase();
    // Exact key match
    if (keyLower === domainLower) { aliases = list; break; }
    // Key contains offer domain or vice-versa (full phrase)
    if (keyLower.includes(domainLower) || domainLower.includes(keyLower)) { aliases = list; break; }
    // Any alias exactly equals offer domain
    if (list.some(a => a === domainLower)) { aliases = list; break; }
    // Offer domain contains a full alias phrase (e.g. "it" in "information technology")
    if (list.some(a => domainLower.includes(a) && a.length >= 3)) { aliases = list; break; }
  }

  if (!aliases) return 30;

  const prog = (programme || '').toLowerCase().trim();
  const fac  = (faculty   || '').toLowerCase().trim();

  // Full-phrase matching — avoid single-word collisions across domains
  const phraseMatch = (text, aliasList) =>
    aliasList.some(a => {
      if (a.length < 3) return false; // skip very short aliases
      return text === a || text.includes(a) || a.includes(text);
    });

  if (prog && phraseMatch(prog, aliases)) return 100;
  if (fac  && phraseMatch(fac,  aliases)) return 65;

  return 15;
}

function studyLevelScore(studentYear, requirements) {
  if (!studentYear) return 50;
  const req = (requirements || '').toLowerCase();

  const patterns = [
    { re: /final[- ]?year|last[- ]?year|5[eè]me ann[ée]e|licence\s*3\b|master/i, min: 4 },
    { re: /4[eè]me|4th[- ]?year|year\s*4\b/i,                                    min: 4 },
    { re: /3[eè]me|3rd[- ]?year|year\s*3\b/i,                                    min: 3 },
    { re: /bachelor|licence\s*[12]\b|undergraduate/i,                             min: 2 },
  ];

  let required = 2;
  for (const { re, min } of patterns) {
    if (re.test(req)) { required = min; break; }
  }

  if (studentYear >= required)       return 100;
  if (studentYear === required - 1)  return 70;
  if (studentYear === required - 2)  return 40;
  return 20;
}

function languageScore(studentLangs, requirements, description) {
  const text = `${requirements || ''} ${description || ''}`.toLowerCase();
  const needed = [];
  if (/\benglish\b/.test(text))           needed.push('english');
  if (/\bfrench\b|\bfrançais\b/.test(text)) needed.push('french');

  if (needed.length === 0) return 100;

  const have = (studentLangs || []).map(l => l.toLowerCase());
  // Cameroonians default assumption: know at least one official language
  const covered = needed.filter(l => have.some(h => h.includes(l)) || l === 'french' || l === 'english');
  return Math.round((covered.length / needed.length) * 100);
}

function getVerdict(score) {
  if (score >= 75) return 'Excellent Match';
  if (score >= 55) return 'Good Match';
  if (score >= 35) return 'Partial Match';
  return 'Low Match';
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Compute a match score between a student profile and an internship offer.
 * Returns the same shape as the AI response so the frontend needs no changes.
 */
function computeFallbackMatch(student, offer) {
  const merged = [
    ...(student.skills || []),
    ...((student.ai_summary?.skills) || []),
  ];

  const sk = skillsCoverage(merged, offer.required_skills);
  const ds = domainScore(student.programme, student.faculty, offer.domain);
  const ls = studyLevelScore(student.study_year, offer.requirements);
  const lg = languageScore(student.languages, offer.requirements, offer.description);

  const score = Math.min(100, Math.round(
    sk.score * WEIGHTS.skills +
    ds       * WEIGHTS.domain +
    ls       * WEIGHTS.level +
    lg       * WEIGHTS.language
  ));

  // Structured per-factor breakdown — consumed by the "Why this match?" UI.
  // Same shape is produced by the AI path in aiController so the frontend
  // never branches on `method`.
  const breakdown = {
    skills:   { score: sk.score / 100, matched: sk.matched, missing: sk.missing },
    domain:   { score: ds / 100 },
    level:    { score: ls / 100 },
    language: { score: lg / 100 },
  };

  // Build human-readable strengths and gaps
  const strengths = [];
  const gaps = [];

  const offerSkills = offer.required_skills || [];
  if (sk.matched.length > 0) {
    strengths.push(`${sk.matched.slice(0, 3).join(', ')} ${sk.matched.length > 3 ? `+${sk.matched.length - 3} more ` : ''}matched`);
  }
  if (sk.missing.length > 0) {
    gaps.push(`Missing: ${sk.missing.slice(0, 3).join(', ')}${sk.missing.length > 3 ? ` (+${sk.missing.length - 3})` : ''}`);
  }

  if (ds >= 75) strengths.push(`${student.programme || 'Your programme'} aligns with ${offer.domain}`);
  else if (ds < 35) gaps.push(`Programme may not match the ${offer.domain} domain`);

  if (ls >= 75) strengths.push(`Year ${student.study_year} meets experience level`);
  else if (ls < 40) gaps.push('Role may expect a more senior student');

  const offerSkillList = offerSkills.slice(0, 2).join(' and ') || offer.domain || 'this role';
  const tip = gaps.length === 0
    ? `Strong match — highlight your ${offerSkillList} experience in your cover letter.`
    : `Strengthen your profile by adding missing skills and tailoring your cover letter to ${offer.domain || 'this domain'}.`;

  return {
    score,
    verdict:  getVerdict(score),
    strengths,
    gaps,
    tip,
    breakdown,
    method: 'algorithmic',
  };
}

/**
 * Same as computeFallbackMatch but also returns `reasons` for recommendation UI.
 */
function computeRecommendationReasons(student, offer) {
  const match = computeFallbackMatch(student, offer);
  const reasons = [];

  if (student.programme) {
    const ds = domainScore(student.programme, student.faculty, offer.domain);
    if (ds >= 65) reasons.push(`Matches your ${student.programme} programme`);
  }

  const matched = match.breakdown.skills.matched;
  if (matched.length > 0) {
    reasons.push(`Matches ${matched.slice(0, 2).join(', ')} skill${matched.length !== 1 ? 's' : ''}`);
  }

  if (student.study_year) {
    const ls = studyLevelScore(student.study_year, offer.requirements);
    if (ls >= 75) reasons.push(`Suitable for Year ${student.study_year} students`);
  }

  return {
    ...match,
    reasons: reasons.length > 0 ? reasons : ['Based on your profile'],
  };
}

module.exports = { computeFallbackMatch, computeRecommendationReasons, getVerdict, normalizeSkill };
