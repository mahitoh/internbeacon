const { PDFParse } = require('pdf-parse'); // v2 class API — calling the module as a function throws
const { supabaseAdmin } = require('../config/supabase');
const { callAI, extractJSON, getActiveProviders } = require('../utils/aiProvider');
const { computeMatch, extractSkillsFromText, extractLanguagesFromText } = require('../utils/matchingEngine');

const isDev = process.env.NODE_ENV !== 'production';

// ── GET /api/ai/providers ─────────────────────────────────────────────────────
exports.providers = (req, res) => {
  const active = getActiveProviders();
  res.json({ success: true, data: { active, count: active.length } });
};

// ── POST /api/ai/parse-cv ─────────────────────────────────────────────────────
exports.parseCv = async (req, res, next) => {
  try {
    const { data: profile, error: pErr } = await supabaseAdmin
      .from('student_profiles')
      .select('id, cv_url, first_name, last_name')
      .eq('user_id', req.user.userId)
      .single();

    if (pErr || !profile) return res.status(404).json({ success: false, message: 'Student profile not found' });
    if (!profile.cv_url)   return res.status(400).json({ success: false, message: 'No CV uploaded yet. Please upload your CV first.' });

    const { data: fileData, error: dlErr } = await supabaseAdmin.storage
      .from('cvs')
      .download(profile.cv_url);

    if (dlErr || !fileData) return res.status(404).json({ success: false, message: 'CV file not found in storage' });

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const parsed = await parser.getText();
    const cvText = parsed.text?.slice(0, 8000) || '';

    if (!cvText.trim()) return res.status(400).json({ success: false, message: 'Could not extract text from CV. Make sure your CV is a text-based PDF.' });

    const prompt = `You are a CV parser for an internship platform in Cameroon. Extract structured information from this CV.

CV TEXT:
${cvText}

Respond with ONLY valid JSON, no explanation:
{
  "skills": ["skill1", "skill2", ...],
  "education": [{ "degree": "...", "institution": "...", "year": "..." }],
  "experience": [{ "role": "...", "company": "...", "duration": "..." }],
  "languages": ["French", "English", ...],
  "summary": "2-3 sentence professional summary"
}

Rules:
- skills: technical and soft skills, max 20 items
- education: most recent first
- experience: internships and jobs, most recent first, max 5 items
- languages: spoken languages only
- summary: written in third person`;

    // Try AI first (richest output); if every provider is down OR the response
    // can't be parsed, fall back to deterministic keyword extraction so CV parsing
    // never fully fails. The matching engine only needs skills + languages.
    let extracted = null;
    let method = 'ai';
    try {
      const { text } = await callAI(prompt, 1024);
      extracted = extractJSON(text);
    } catch (aiErr) {
      if (isDev) console.warn('[parse-cv] AI unavailable, using keyword fallback:', aiErr.message);
    }

    if (!extracted || !Array.isArray(extracted.skills) || extracted.skills.length === 0) {
      method = 'keyword';
      extracted = {
        skills:     extractSkillsFromText(cvText),
        languages:  (extracted?.languages?.length ? extracted.languages : extractLanguagesFromText(cvText)),
        education:  extracted?.education  || [],
        experience: extracted?.experience || [],
        summary:    extracted?.summary    || '',
      };
    }

    const updatePayload = {
      ai_summary: { ...extracted, method },
      updated_at: new Date().toISOString(),
    };

    const { data: current } = await supabaseAdmin
      .from('student_profiles').select('skills, languages').eq('user_id', req.user.userId).single();

    // REPLACE the profile's skills with this CV's skills (de-duplicated).
    // Merging/union caused every uploaded CV to pile its skills on top of the last
    // one, so a profile ended up matching every domain and all offers scored the
    // same. A CV should define the candidate's skills, not accumulate forever.
    // If extraction found nothing, keep the existing skills rather than wiping them.
    const dedupe = (arr) => {
      const out = [], seen = new Set();
      for (const x of (arr || [])) {
        const key = String(x).toLowerCase().trim();
        if (key && !seen.has(key)) { seen.add(key); out.push(x); }
      }
      return out;
    };
    const extractedSkills = dedupe(extracted.skills);
    const mergedSkills = extractedSkills.length ? extractedSkills : (current?.skills || []);
    updatePayload.skills = mergedSkills;

    const extractedLangs = dedupe(extracted.languages);
    const mergedLangs = extractedLangs.length ? extractedLangs : (current?.languages || []);
    if (mergedLangs.length) updatePayload.languages = mergedLangs;

    await supabaseAdmin.from('student_profiles').update(updatePayload).eq('user_id', req.user.userId);

    // Return the merged skills/languages so the client can reflect them immediately
    res.json({ success: true, data: { ...extracted, skills: mergedSkills, languages: mergedLangs, method } });
  } catch (err) { next(err); }
};

// ── GET /api/ai/match-offer/:offerId ──────────────────────────────────────────
exports.matchOffer = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const [{ data: student }, { data: offer }] = await Promise.all([
      supabaseAdmin
        .from('student_profiles')
        .select('skills, programme, faculty, study_year, city, languages, ai_summary')
        .eq('user_id', req.user.userId)
        .single(),
      supabaseAdmin
        .from('internship_offers')
        .select('title, domain, location, description, requirements, required_skills')
        .eq('id', offerId)
        .single(),
    ]);

    if (!student || !offer) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: computeMatch(student, offer) });
  } catch (err) { next(err); }
};

// ── GET /api/ai/rank-applicants/:offerId ──────────────────────────────────────
exports.rankApplicants = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const { data: cp } = await supabaseAdmin
      .from('company_profiles').select('id').eq('user_id', req.user.userId).single();
    if (!cp) return res.status(400).json({ success: false, message: 'Company profile not found' });

    const { data: offer } = await supabaseAdmin
      .from('internship_offers')
      .select('id, title, domain, location, description, requirements, required_skills')
      .eq('id', offerId).eq('company_id', cp.id).single();
    if (!offer) return res.status(403).json({ success: false, message: 'Offer not found or access denied' });

    const TERMINAL = ['accepted', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'];
    const { data: apps } = await supabaseAdmin
      .from('applications')
      .select('id, status, student_profiles(skills, programme, faculty, study_year, city, languages, ai_summary)')
      .eq('offer_id', offerId)
      .not('status', 'in', `(${TERMINAL.join(',')})`)
      .order('applied_at', { ascending: false })
      .limit(100);

    if (!apps?.length) return res.json({ success: true, data: [] });

    const rankings = apps
      .map(a => {
        const sp     = a.student_profiles || {};
        const result = computeMatch(sp, offer);
        return {
          appId:   a.id,
          score:   result.score,
          verdict: result.verdict,
          reason:  result.strengths[0] || `${result.score}% match`,
          method:  'algorithmic',
        };
      })
      .sort((a, b) => b.score - a.score);

    res.json({ success: true, data: rankings });
  } catch (err) { next(err); }
};
