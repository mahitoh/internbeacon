/**
 * InternBeacon Matching Engine — 5-factor weighted scoring model.
 *
 * Weights (thesis Chapter 4, single source of truth):
 *   Skills    35% — coverage: matched required skills ÷ total required skills
 *   Programme 30% — domain taxonomy match between student programme and offer domain
 *   Location  15% — city / region / remote proximity
 *   Level     15% — study year vs. stated requirement (raised from 10%)
 *   Language   5% — stated language requirements vs. student languages (lowered from 10%)
 */

// ── Weights ────────────────────────────────────────────────────────────────────

const WEIGHTS = {
  skills:   0.35,
  domain:   0.30,
  location: 0.15,
  level:    0.15,
  language: 0.05,
};

// ── Skill normalization ────────────────────────────────────────────────────────

const SKILL_ALIASES = {
  'js':              'javascript', 'javascript es6': 'javascript', 'es6': 'javascript',
  'reactjs':         'react',      'react.js': 'react',            'react js': 'react',
  'node':            'nodejs',     'node.js': 'nodejs',            'node js': 'nodejs',
  'postgres':        'postgresql', 'psql': 'postgresql',
  'py':              'python',     'python3': 'python',
  'html5':           'html',       'css3': 'css',
  'ms excel':        'excel',      'microsoft excel': 'excel',
  'ms word':         'word',       'microsoft word': 'word',
  'ts':              'typescript', 'type script': 'typescript',
  'tailwindcss':     'tailwind',   'tailwind css': 'tailwind',
  'expressjs':       'express',    'express.js': 'express',
  'vuejs':           'vue',        'vue.js': 'vue',
  'nextjs':          'next.js',    'next js': 'next.js',
  'c sharp':         'c#',         'csharp': 'c#',
  'golang':          'go',
  'ml':              'machine learning',
  'ai':              'artificial intelligence',
  'db':              'databases',  'database': 'databases',
  'ui/ux':           'ui-ux design', 'ux/ui': 'ui-ux design', 'ui ux': 'ui-ux design',
  'ms powerpoint':   'powerpoint', 'microsoft powerpoint': 'powerpoint',
  'ms access':       'access',     'microsoft access': 'access',
  'gestion':         'management', 'comptabilite': 'accounting', 'comptabilité': 'accounting',
  'rh':              'human resources', 'ressources humaines': 'human resources',
  'photoshop':       'adobe photoshop', 'illustrator': 'adobe illustrator',
};

function normalizeSkill(s) {
  const cleaned = String(s || '').trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

// ── Academic field classification (student side) ───────────────────────────────
// Maps a student's programme/faculty text to a canonical academic field.
// Returns null when the programme is not recognized — never silently penalizes.

const ACADEMIC_FIELDS = {
  computer_science: [
    'computer science', 'informatique', 'software engineering', 'génie informatique',
    'genie informatique', 'information technology', 'information systems', 'it',
    'systems', 'cybersecurity', 'data science', 'réseaux', 'reseaux',
    'computer engineering', 'informatics', 'computer networks',
  ],
  telecom: [
    'telecommunications', 'télécommunications', 'telecom', 'electronic engineering',
    'network engineering', 'électronique', 'electronique', 'telecom engineering',
  ],
  engineering: [
    'mechanical engineering', 'civil engineering', 'electrical engineering',
    'industrial engineering', 'environmental engineering', 'chemical engineering',
    'génie civil', 'genie civil', 'génie mécanique', 'genie mecanique',
    'génie électrique', 'genie electrique', 'génie industriel', 'genie industriel',
    'génie chimique', 'engineering',
  ],
  finance: [
    'finance', 'banking', 'finance bancaire', 'finance et banque',
    'financial management', 'banque', 'finance internationale',
  ],
  accounting: [
    'accounting', 'comptabilité', 'comptabilite', 'auditing', 'audit',
    'audit et contrôle', 'audit et controle', 'contrôle de gestion',
    'controle de gestion', 'expertise comptable',
  ],
  economics: [
    'economics', 'économie', 'economie', 'sciences économiques',
    'sciences economiques', 'economic', 'économie appliquée',
  ],
  management: [
    'management', 'business administration', 'gestion', 'sciences de gestion',
    'administration des affaires', 'commerce', 'gestion des entreprises',
    'gestion commerciale', 'entrepreneurship', 'entrepreneuriat',
  ],
  marketing: [
    'marketing', 'vente', 'sales', 'commercial', 'communication commerciale',
    'marketing et vente', 'marketing management',
  ],
  hr: [
    'human resources', 'ressources humaines', 'gestion rh', 'grh',
    'gestion des ressources humaines', 'hr management', 'human resource management',
  ],
  communication: [
    'communication', 'journalism', 'journalisme', 'media', 'public relations',
    'relations publiques', 'sciences de la communication', 'communication et médias',
    'communication et medias', 'information et communication',
  ],
  law: [
    'law', 'droit', 'legal', 'jurisprudence', 'sciences juridiques',
    'droit des affaires', 'droit privé', 'droit prive', 'droit public',
    'droit international', 'sciences politiques', 'political science',
  ],
  education: [
    'education', 'teaching', 'enseignement', 'pédagogie', 'pedagogie',
    'sciences de l\'éducation', "sciences de l'education", 'formation',
  ],
  health: [
    'medicine', 'médecine', 'medecine', 'pharmacy', 'pharmacie', 'nursing',
    'infirmier', 'infirmière', 'biomedical', 'public health', 'santé publique',
    'sante publique', 'health sciences', 'sciences de la santé', 'sciences de la sante',
    'médecine vétérinaire', 'veterinary',
  ],
  agriculture: [
    'agriculture', 'agronomy', 'agronomie', 'environmental science', 'biology',
    'biologie', 'sciences naturelles', 'forestry', 'animal science',
    'sciences agricoles', 'agroalimentaire', 'food science',
  ],
  social_sciences: [
    'sociology', 'sociologie', 'psychology', 'psychologie', 'social work',
    'travail social', 'anthropology', 'anthropologie', 'sciences sociales',
  ],
};

function classifyProgramme(text) {
  if (!text) return null;
  const t = text.toLowerCase().trim();

  // Find the field whose longest keyword matches — prevents short keywords like
  // 'it' (in 'droit') or 'telecommunications' containing 'communication' from
  // producing false positives. Exact match always wins; substring requires length >= 5.
  let bestField = null;
  let bestLen   = 0;

  for (const [field, keywords] of Object.entries(ACADEMIC_FIELDS)) {
    for (const k of keywords) {
      const exact     = k === t;
      const substring = k.length >= 5 && t.includes(k);
      if ((exact || substring) && k.length > bestLen) {
        bestField = field;
        bestLen   = k.length;
      }
    }
  }
  return bestField;
}

// ── Offer domain → academic field cross-reference ──────────────────────────────
// Values: 1.0 = direct, 0.6 = related, 0.0 = no overlap

const DOMAIN_FIELD_MAP = {
  'Information Technology': {
    computer_science: 1.0, telecom: 0.7, engineering: 0.5,
    management: 0.2, economics: 0.2,
  },
  'Finance & Banking': {
    finance: 1.0, accounting: 0.8, economics: 0.8,
    management: 0.6, law: 0.3,
  },
  'Accounting & Audit': {
    accounting: 1.0, finance: 0.8, economics: 0.6, management: 0.5,
  },
  'Marketing & Sales': {
    marketing: 1.0, communication: 0.7, management: 0.6,
    economics: 0.4, social_sciences: 0.3,
  },
  'Human Resources': {
    hr: 1.0, management: 0.7, social_sciences: 0.6,
    law: 0.4, communication: 0.3,
  },
  'Communication & Media': {
    communication: 1.0, marketing: 0.6, social_sciences: 0.4,
    education: 0.3,
  },
  'Engineering': {
    engineering: 1.0, telecom: 0.6, computer_science: 0.5,
    agriculture: 0.3,
  },
  'Telecommunications': {
    telecom: 1.0, computer_science: 0.8, engineering: 0.6,
  },
  'Agriculture': {
    agriculture: 1.0, health: 0.3, engineering: 0.3,
  },
  'Healthcare': {
    health: 1.0, agriculture: 0.3, social_sciences: 0.2,
  },
  'Legal & Compliance': {
    law: 1.0, management: 0.3, finance: 0.2,
  },
  'Education & Training': {
    education: 1.0, social_sciences: 0.5, communication: 0.3, management: 0.2,
  },
  'General Management': {
    management: 1.0, hr: 0.7, economics: 0.6, marketing: 0.6,
    finance: 0.5, accounting: 0.4, communication: 0.4, law: 0.4,
  },
  // Legacy taxonomy keys kept for backward compatibility
  'Marketing & Sales (legacy)': { marketing: 1.0, communication: 0.7, management: 0.6 },
};

// Normalize offer domain key (handles slight variations in how companies write it)
function resolveDomainMap(offerDomain) {
  if (!offerDomain) return null;
  const key = offerDomain.trim();
  if (DOMAIN_FIELD_MAP[key]) return DOMAIN_FIELD_MAP[key];
  // Fuzzy match — pick the LONGEST overlapping taxonomy key so a multi-word
  // domain isn't hijacked by a short partial match that happens to appear
  // earlier in object order (e.g. "Finance" winning over "Finance & Banking").
  const lower = key.toLowerCase();
  let best = null, bestLen = 0;
  for (const [k, v] of Object.entries(DOMAIN_FIELD_MAP)) {
    const kl = k.toLowerCase();
    if ((kl.includes(lower) || lower.includes(kl)) && kl.length > bestLen) {
      best = v; bestLen = kl.length;
    }
  }
  return best;
}

// ── Cameroonian region groups ──────────────────────────────────────────────────

const CAMEROON_REGIONS = [
  ['yaoundé', 'yaounde', 'centre'],
  ['douala', 'littoral'],
  ['bafoussam', 'ouest', 'west'],
  ['bamenda', 'nord-ouest', 'northwest', 'nw'],
  ['garoua', 'nord', 'north'],
  ['ngaoundéré', 'ngaoundere', 'adamaoua'],
  ['bertoua', 'est', 'east'],
  ['ebolowa', 'sud', 'south'],
  ['buea', 'limbé', 'limbe', 'sud-ouest', 'southwest', 'sw'],
  ['maroua', 'extrême-nord', 'extreme-north', 'far-north'],
];

// ── Core scoring functions ─────────────────────────────────────────────────────

function skillsCoverage(studentSkills, offerSkills) {
  if (!offerSkills || offerSkills.length === 0) {
    // Offer lists no requirements — less information, not neutral
    return { score: 30, matched: [], missing: [], noRequirements: true };
  }
  const have = new Set((studentSkills || []).map(normalizeSkill).filter(Boolean));
  const matched = [];
  const missing = [];
  for (const skill of offerSkills) {
    (have.has(normalizeSkill(skill)) ? matched : missing).push(skill);
  }
  return {
    score: Math.max(5, Math.round((matched.length / offerSkills.length) * 100)),
    matched,
    missing,
    noRequirements: false,
  };
}

function domainScore(programme, faculty, offerDomain) {
  const field = classifyProgramme(programme) || classifyProgramme(faculty);
  if (!field) return null; // programme not recognized — do not score

  const domainMap = resolveDomainMap(offerDomain);
  if (!domainMap) return null; // offer domain not recognized

  const strength = domainMap[field] ?? 0;
  return Math.round(strength * 100);
}

function locationScore(studentCity, offerLocation) {
  if (!offerLocation) return 50;
  const loc = offerLocation.toLowerCase().trim();

  if (/remote|télétravail|teletravail|en ligne|online|à distance|distance/i.test(loc)) return 100;
  if (!studentCity) return 50;

  const city = studentCity.toLowerCase().trim();
  if (city === loc || loc.includes(city) || city.includes(loc)) return 100;

  const sameRegion = CAMEROON_REGIONS.some(
    group => group.some(t => city.includes(t)) && group.some(t => loc.includes(t))
  );
  if (sameRegion) return 60;
  return 30;
}

function studyLevelScore(studentYear, requirements) {
  if (!studentYear) return 50;
  const req = (requirements || '').toLowerCase();
  const patterns = [
    { re: /final[- ]?year|last[- ]?year|5[eè]me ann[ée]e|master/i, min: 4 },
    { re: /4[eè]me|4th[- ]?year|year\s*4\b/i,                      min: 4 },
    // Licence 3 (LMD) is the 3rd / final bachelor year — not a 4th-year requirement.
    { re: /3[eè]me|3rd[- ]?year|year\s*3\b|licence\s*3\b/i,        min: 3 },
    { re: /bachelor|licence\s*[12]\b|undergraduate/i,             min: 2 },
  ];
  let required = 2;
  for (const { re, min } of patterns) {
    if (re.test(req)) { required = min; break; }
  }
  if (studentYear >= required)      return 100;
  if (studentYear === required - 1) return 70;
  if (studentYear === required - 2) return 40;
  return 20;
}

function languageScore(studentLangs, requirements, description) {
  const text = `${requirements || ''} ${description || ''}`.toLowerCase();
  const needed = [];
  if (/\benglish\b|\banglais\b/.test(text))          needed.push('english');
  if (/\bfrench\b|\bfran[çc]ais\b/.test(text))        needed.push('french');
  if (needed.length === 0) return 100;
  // Match either the English name or the French label a student may have typed.
  const have = (studentLangs || []).map(l => l.toLowerCase());
  const speaks = {
    english: have.some(h => h.includes('english') || h.includes('anglais')),
    french:  have.some(h => h.includes('french')  || h.includes('fran')),
  };
  const covered = needed.filter(l => speaks[l]);
  return Math.round((covered.length / needed.length) * 100);
}

function getVerdict(score) {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Good Match';
  if (score >= 50) return 'Moderate Match';
  return 'Low Match';
}

// ── Blocking conditions ────────────────────────────────────────────────────────
// Prevents disqualifying hard mismatches from being masked by other perfect scores.

function applyBlockingConditions(score, verdict, ls, lc) {
  // Study year hard requirement not met — flag for review and cap the score at 64.
  if (ls <= 40) {
    return {
      score:   Math.min(score, 64),
      verdict: 'Review Carefully',
      warning: 'This role specifies a minimum study year you may not meet yet.',
    };
  }
  // Clear location mismatch — downgrade Excellent → Good
  if (lc <= 30 && verdict === 'Excellent Match') {
    return {
      score,
      verdict: 'Good Match',
      warning: 'This offer is in a different city — relocation may be required.',
    };
  }
  return { score, verdict, warning: null };
}

// ── Public API ─────────────────────────────────────────────────────────────────

function computeMatch(student, offer) {
  const mergedSkills = [
    ...(student.skills || []),
    ...((student.ai_summary?.skills) || []),
  ];

  const sk = skillsCoverage(mergedSkills, offer.required_skills);
  const ds = domainScore(student.programme, student.faculty, offer.domain);
  const lc = locationScore(student.city, offer.location);
  const ls = studyLevelScore(student.study_year ?? student.studyYear, offer.requirements);
  const lg = languageScore(student.languages, offer.requirements, offer.description);

  // When domain is unknown, redistribute its weight to skills for a fairer score
  const domainUnknown = ds === null;
  const dsValue = ds ?? 50; // neutral fallback when unrecognized
  const effectiveWeights = domainUnknown
    ? { ...WEIGHTS, skills: WEIGHTS.skills + WEIGHTS.domain * 0.5, domain: WEIGHTS.domain * 0.5 }
    : WEIGHTS;

  const rawScore = Math.min(100, Math.round(
    sk.score   * effectiveWeights.skills +
    dsValue    * effectiveWeights.domain +
    lc         * effectiveWeights.location +
    ls         * effectiveWeights.level +
    lg         * effectiveWeights.language
  ));

  const { score, verdict, warning } = applyBlockingConditions(rawScore, getVerdict(rawScore), ls, lc);

  const breakdown = {
    skills:   { score: sk.score / 100, matched: sk.matched, missing: sk.missing, noRequirements: sk.noRequirements },
    domain:   { score: dsValue / 100, unknown: domainUnknown },
    location: { score: lc / 100 },
    level:    { score: ls / 100 },
    language: { score: lg / 100 },
  };

  const strengths = [];
  const gaps = [];

  if (sk.matched.length > 0)
    strengths.push(`${sk.matched.slice(0, 3).join(', ')}${sk.matched.length > 3 ? ` +${sk.matched.length - 3} more` : ''} matched`);
  if (sk.missing.length > 0)
    gaps.push(`Missing: ${sk.missing.slice(0, 3).join(', ')}${sk.missing.length > 3 ? ` (+${sk.missing.length - 3})` : ''}`);
  if (!domainUnknown && dsValue >= 75)
    strengths.push(`${student.programme || 'Your programme'} aligns with ${offer.domain}`);
  else if (!domainUnknown && dsValue < 35)
    gaps.push(`Programme may not match the ${offer.domain} domain`);
  if (lc === 100)
    strengths.push(/remote/i.test(offer.location || '') ? 'Remote — open to all locations' : `Located in ${offer.location}`);
  else if (lc <= 30)
    gaps.push(`Offer is in ${offer.location} — consider relocation`);
  if (ls >= 75)
    strengths.push(`Year ${student.study_year ?? student.studyYear} meets experience level`);
  else if (ls <= 40)
    gaps.push('Role may expect a more senior student');
  if (warning)
    gaps.push(warning);

  const offerSkillSample = (offer.required_skills || []).slice(0, 2).join(' and ') || offer.domain || 'this role';
  const tip = gaps.length === 0
    ? `Strong match — highlight your ${offerSkillSample} experience in your cover letter.`
    : `Strengthen your profile by adding missing skills and tailoring your cover letter to ${offer.domain || 'this domain'}.`;

  return {
    score,
    verdict,
    warning,
    strengths,
    gaps,
    tip,
    breakdown,
    method: 'algorithmic',
  };
}

function computeRecommendationReasons(student, offer) {
  const match = computeMatch(student, offer);
  const reasons = [];

  // Reuse the breakdown already computed by computeMatch — no recomputation.
  const { domain, skills, level } = match.breakdown;

  if (student.programme && !domain.unknown && domain.score >= 0.65)
    reasons.push(`Matches your ${student.programme} programme`);

  const matched = skills.matched;
  if (matched.length > 0)
    reasons.push(`Matches ${matched.slice(0, 2).join(', ')} skill${matched.length !== 1 ? 's' : ''}`);

  const studyYear = student.study_year ?? student.studyYear;
  if (studyYear && level.score >= 0.75)
    reasons.push(`Suitable for Year ${studyYear} students`);

  return {
    ...match,
    reasons: reasons.length > 0 ? reasons : ['Based on your profile'],
  };
}

// ── Deterministic CV skill extraction (no-AI fallback) ──────────────────────────
// Scans raw CV text for known skills/languages so CV parsing degrades gracefully
// when every AI provider is unavailable. Output names mirror how offers list
// required_skills, so they match cleanly after normalizeSkill().

const SKILL_VOCAB = [
  ['JavaScript', /\bjavascript\b|\bjs\b/],
  ['TypeScript', /\btypescript\b/],
  ['React', /\breact(\.?js)?\b/],
  ['Node.js', /\bnode(\.?js)?\b/],
  ['Express', /\bexpress(\.?js)?\b/],
  ['Vue', /\bvue(\.?js)?\b/],
  ['Next.js', /\bnext\.?js\b/],
  ['HTML', /\bhtml5?\b/],
  ['CSS', /\bcss3?\b/],
  ['Tailwind', /\btailwind(\s?css)?\b/],
  ['PostgreSQL', /\bpostgre(sql)?\b|\bpsql\b/],
  ['PostGIS', /\bpostgis\b/],
  ['SQL', /\bsql\b/],
  ['MongoDB', /\bmongo(db)?\b/],
  ['Python', /\bpython\b/],
  ['Java', /\bjava\b/],
  ['C#', /\bc#|\bc sharp\b|\bcsharp\b/],
  ['C++', /\bc\+\+/],
  ['Git', /\bgit(hub)?\b/],
  ['AWS', /\baws\b|amazon web services/],
  ['Docker', /\bdocker\b/],
  ['Flutter', /\bflutter\b/],
  ['Dart', /\bdart\b/],
  ['REST APIs', /\brest ?apis?\b|\brestful\b/],
  ['Figma', /\bfigma\b/],
  ['Excel', /\bexcel\b/],
  ['PowerPoint', /\bpower ?point\b/],
  ['Office 365', /\boffice ?365\b|\bms office\b|microsoft office/],
  ['Windows', /\bwindows\b/],
  ['Active Directory', /\bactive directory\b/],
  ['IT Support', /\bit support\b|help ?desk|technical support/],
  ['Networking', /\bnetworking\b|\bnetworks?\b/],
  ['TCP/IP', /\btcp\/?ip\b/],
  ['Cisco', /\bcisco\b/],
  ['Fibre Optics', /\bfib(re|er) optics?\b/],
  ['QGIS', /\bqgis\b/],
  ['GIS', /\bgis\b/],
  ['Remote Sensing', /\bremote sensing\b/],
  ['Statistics', /\bstatistic(s|al)?\b/],
  ['Epidemiology', /\bepidemiolog(y|ical)\b/],
  ['Data Visualization', /\bdata vis(ualization|ualisation)\b|power ?bi|tableau/],
  ['Data Collection', /\bdata collection\b/],
  ['Machine Learning', /\bmachine learning\b/],
  ['Agronomy', /\bagronom(y|ist)\b/],
  ['Accounting', /\baccounting\b|\bcomptabilit/],
  ['Financial Analysis', /\bfinancial analysis\b/],
  ['Finance', /\bfinance\b/],
  ['Logistics', /\blogistics\b/],
  ['Supply Chain', /\bsupply chain\b/],
  ['Documentation', /\bdocumentation\b/],
  ['Maintenance Planning', /\bmaintenance planning\b/],
  ['Mechanical Engineering', /\bmechanical engineering\b/],
  ['AutoCAD', /\bautocad\b/],
  ['Product Research', /\bproduct research\b/],
  ['UX Research', /\bux research\b/],
  ['UI-UX Design', /\bui[\/ -]?ux\b|\bux[\/ -]?ui\b|user experience|user interface/],
  ['Prototyping', /\bprototyp(e|es|ing)\b/],
  ['Wireframing', /\bwireframe?(ing|s)?\b/],
  ['Video Editing', /\bvideo editing\b/],
  ['Premiere Pro', /\bpremiere( pro)?\b/],
  ['Videography', /\bvideograph(y|er)\b/],
  ['Storytelling', /\bstorytelling\b/],
  ['Social Media', /\bsocial media\b/],
  ['Content Creation', /\bcontent creat(ion|or)\b/],
  ['Canva', /\bcanva\b/],
  ['Copywriting', /\bcopywrit(ing|er)\b/],
  ['Marketing', /\bmarketing\b/],
  ['Adobe Photoshop', /\bphotoshop\b/],
  ['Adobe Illustrator', /\billustrator\b/],
  ['Teaching', /\bteaching\b|\bteacher\b/],
  ['Linux', /\blinux\b/],
];

function extractSkillsFromText(text) {
  const t = ` ${String(text || '').toLowerCase()} `;
  const found = [];
  for (const [name, re] of SKILL_VOCAB) {
    if (re.test(t)) found.push(name);
  }
  return found;
}

function extractLanguagesFromText(text) {
  const t = String(text || '').toLowerCase();
  const langs = [];
  if (/\benglish\b|\banglais\b/.test(t))        langs.push('English');
  if (/\bfrench\b|\bfran[çc]ais\b/.test(t))      langs.push('French');
  if (/\bfulfulde\b|\bfulani\b/.test(t))         langs.push('Fulfulde');
  if (/\bspanish\b|\bespagnol\b/.test(t))        langs.push('Spanish');
  if (/\bgerman\b|\ballemand\b/.test(t))         langs.push('German');
  return langs;
}

module.exports = {
  computeMatch, computeRecommendationReasons, getVerdict, normalizeSkill,
  extractSkillsFromText, extractLanguagesFromText,
};
