const { PDFParse } = require('pdf-parse'); // v2 class API — calling the module as a function throws
const { supabaseAdmin } = require('../config/supabase');
const { callAI, extractJSON, getActiveProviders } = require('../utils/aiProvider');
const { computeMatch } = require('../utils/matchingEngine');

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

    let aiText;
    try {
      const { text } = await callAI(prompt, 1024);
      aiText = text;
    } catch (aiErr) {
      if (aiErr.status === 503) {
        return res.status(503).json({
          success: false,
          message: 'AI analysis is currently unavailable. Please try again in a few minutes.',
        });
      }
      throw aiErr;
    }

    let extracted;
    try {
      extracted = extractJSON(aiText);
    } catch {
      return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
    }

    const updatePayload = {
      ai_summary: extracted,
      updated_at: new Date().toISOString(),
    };

    const { data: current } = await supabaseAdmin
      .from('student_profiles').select('skills').eq('user_id', req.user.userId).single();

    if (!current?.skills?.length || current.skills.length < 3) {
      updatePayload.skills = extracted.skills || [];
    }
    if (extracted.languages?.length) {
      updatePayload.languages = extracted.languages;
    }

    await supabaseAdmin.from('student_profiles').update(updatePayload).eq('user_id', req.user.userId);

    res.json({ success: true, data: extracted });
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
