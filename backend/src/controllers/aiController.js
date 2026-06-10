const pdfParse  = require('pdf-parse');
const { supabaseAdmin } = require('../config/supabase');
const { callAI, extractJSON, getActiveProviders } = require('../utils/aiProvider');
const { computeFallbackMatch } = require('../utils/fallbackMatcher');

// ── GET /api/ai/providers ─────────────────────────────────────────────────────
exports.providers = (req, res) => {
  const active = getActiveProviders();
  res.json({
    success: true,
    data: {
      active,
      count: active.length,
    },
  });
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
    const parsed = await pdfParse(buffer);
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

    const { text } = await callAI(prompt, 1024);

    let extracted;
    try {
      extracted = extractJSON(text);
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
        .select('first_name, last_name, skills, bio, programme, faculty, study_year, languages, ai_summary')
        .eq('user_id', req.user.userId)
        .single(),
      supabaseAdmin
        .from('internship_offers')
        .select('title, domain, description, requirements, required_skills, location, duration_weeks')
        .eq('id', offerId)
        .single(),
    ]);

    if (!student || !offer) return res.status(404).json({ success: false, message: 'Not found' });

    const studentContext = [
      `Programme: ${student.programme || 'Not specified'}`,
      `Faculty: ${student.faculty || 'Not specified'}`,
      `Year of study: ${student.study_year || 'Not specified'}`,
      `Skills: ${(student.skills || []).join(', ') || 'None listed'}`,
      `Languages: ${(student.languages || []).join(', ') || 'Not specified'}`,
      student.bio ? `Bio: ${student.bio}` : '',
      student.ai_summary?.experience?.length
        ? `Experience: ${student.ai_summary.experience.map(e => `${e.role} at ${e.company}`).join('; ')}`
        : '',
    ].filter(Boolean).join('\n');

    const offerContext = [
      `Title: ${offer.title}`,
      `Domain: ${offer.domain}`,
      `Description: ${offer.description?.slice(0, 500)}`,
      offer.requirements ? `Requirements: ${offer.requirements.slice(0, 300)}` : '',
      `Required skills: ${(offer.required_skills || []).join(', ') || 'Not specified'}`,
      `Duration: ${offer.duration_weeks} weeks`,
    ].filter(Boolean).join('\n');

    const prompt = `Rate how well this student matches this internship offer. Be concise and honest.

STUDENT:
${studentContext}

OFFER:
${offerContext}

Respond with ONLY valid JSON:
{
  "score": <integer 0-100>,
  "verdict": "<Excellent Match|Good Match|Partial Match|Low Match>",
  "strengths": ["...", "..."],
  "gaps": ["...", "..."],
  "tip": "<one actionable tip to improve chances>"
}`;

    let result;
    try {
      const { text } = await callAI(prompt, 512);
      result = extractJSON(text);
      result.method = 'ai';
    } catch (aiErr) {
      if (aiErr.status === 503) {
        console.log('[AI] All providers failed for matchOffer — using algorithmic fallback');
        result = computeFallbackMatch(student, offer);
      } else {
        return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
      }
    }

    res.json({ success: true, data: result });
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
      .select('id, title, domain, description, requirements, required_skills')
      .eq('id', offerId).eq('company_id', cp.id).single();
    if (!offer) return res.status(403).json({ success: false, message: 'Offer not found or access denied' });

    const { data: apps } = await supabaseAdmin
      .from('applications')
      .select('id, cover_letter, student_id, student_profiles(first_name, last_name, skills, bio, programme, faculty, study_year, languages, ai_summary)')
      .eq('offer_id', offerId);

    if (!apps?.length) return res.json({ success: true, data: [] });

    const candidates = apps.map(a => ({
      appId:       a.id,
      name:        `${a.student_profiles?.first_name || ''} ${a.student_profiles?.last_name || ''}`.trim() || 'Unknown',
      skills:      (a.student_profiles?.skills || []).join(', ') || 'None listed',
      programme:   a.student_profiles?.programme || 'N/A',
      studyYear:   a.student_profiles?.study_year || 'N/A',
      bio:         a.student_profiles?.bio?.slice(0, 200) || '',
      coverLetter: a.cover_letter?.slice(0, 300) || '',
    }));

    const prompt = `Rank these ${candidates.length} candidates for the following internship. Be objective and fair.

OFFER: ${offer.title}
Domain: ${offer.domain}
Required skills: ${(offer.required_skills || []).join(', ') || 'Not specified'}
${offer.requirements ? 'Requirements: ' + offer.requirements.slice(0, 300) : ''}

CANDIDATES:
${candidates.map((c, i) => `${i + 1}. [${c.appId}] ${c.name}
   Programme: ${c.programme}, Year ${c.studyYear}
   Skills: ${c.skills}
   ${c.bio ? 'Bio: ' + c.bio : ''}
   ${c.coverLetter ? 'Cover letter: ' + c.coverLetter : ''}`).join('\n\n')}

Respond with ONLY valid JSON array, ranked best to worst:
[
  { "appId": "...", "score": <0-100>, "verdict": "<Excellent|Good|Fair|Weak>", "reason": "<1 sentence>" },
  ...
]`;

    let rankings;
    try {
      const { text } = await callAI(prompt, 1024);
      rankings = extractJSON(text, true).map(r => ({ ...r, method: 'ai' }));
    } catch (aiErr) {
      if (aiErr.status === 503) {
        console.log('[AI] All providers failed for rankApplicants — using algorithmic fallback');
        rankings = apps.map(a => {
          const sp = a.student_profiles || {};
          const fallback = computeFallbackMatch(sp, offer);
          return {
            appId:   a.id,
            score:   fallback.score,
            verdict: fallback.verdict,
            reason:  fallback.strengths[0] || 'Algorithmic estimate — AI unavailable',
            method:  'algorithmic',
          };
        }).sort((a, b) => b.score - a.score);
      } else {
        return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
      }
    }

    res.json({ success: true, data: rankings });
  } catch (err) { next(err); }
};
