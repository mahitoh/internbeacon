/**
 * Algorithmic match/recommendation engine.
 * Used when all AI providers fail, and for instant recommendations.
 *
 * Formula: 40% skills Jaccard + 25% domain/programme + 20% study level + 15% language
 * Output shape mirrors AI response so the frontend needs no changes.
 */

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

function jaccard(arrA, arrB) {
  const a = new Set((arrA || []).map(s => String(s).toLowerCase().trim()).filter(Boolean));
  const b = new Set((arrB || []).map(s => String(s).toLowerCase().trim()).filter(Boolean));
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

function skillsScore(studentSkills, offerSkills) {
  if (!offerSkills || offerSkills.length === 0) return 50; // neutral: no requirements specified
  const score = Math.round(jaccard(studentSkills, offerSkills) * 100);

  // Soften total mismatch — student still has a baseline score
  return Math.max(score, 5);
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

  const ss = skillsScore(merged, offer.required_skills);
  const ds = domainScore(student.programme, student.faculty, offer.domain);
  const ls = studyLevelScore(student.study_year, offer.requirements);
  const lg = languageScore(student.languages, offer.requirements, offer.description);

  const score = Math.min(100, Math.round(ss * 0.40 + ds * 0.25 + ls * 0.20 + lg * 0.15));

  // Build human-readable strengths and gaps
  const strengths = [];
  const gaps = [];

  const offerSkills = offer.required_skills || [];
  if (offerSkills.length > 0) {
    const mergedLower = merged.map(s => s.toLowerCase().trim());
    const matched  = offerSkills.filter(s => mergedLower.includes(s.toLowerCase().trim()));
    const missing  = offerSkills.filter(s => !mergedLower.includes(s.toLowerCase().trim()));
    if (matched.length > 0) {
      strengths.push(`${matched.slice(0, 3).join(', ')} ${matched.length > 3 ? `+${matched.length - 3} more ` : ''}matched`);
    }
    if (missing.length > 0) {
      gaps.push(`Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` (+${missing.length - 3})` : ''}`);
    }
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

  const merged = [...(student.skills || []), ...((student.ai_summary?.skills) || [])];
  const offerSkills = offer.required_skills || [];
  const matched = offerSkills.filter(s =>
    merged.some(ss => ss.toLowerCase().trim() === s.toLowerCase().trim())
  );
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

module.exports = { computeFallbackMatch, computeRecommendationReasons, getVerdict };
