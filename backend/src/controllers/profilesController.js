const { supabaseAdmin } = require('../config/supabase');

// ── PATCH /api/profiles/student ────────────────────────────────────────────────
exports.updateStudent = async (req, res, next) => {
  try {
    const fieldMap = {
      firstName: 'first_name', lastName: 'last_name', phone: 'phone',
      university: 'university', faculty: 'faculty', programme: 'programme',
      studyYear: 'study_year', bio: 'bio', skills: 'skills',
      languages: 'languages', city: 'city', cvUrl: 'cv_url', avatarUrl: 'avatar_url',
      linkedinUrl: 'linkedin_url', githubUrl: 'github_url',
    };

    const updates = {};
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
    }

    if (updates.study_year !== undefined) {
      const yr = Number(updates.study_year);
      if (!Number.isInteger(yr) || yr < 1 || yr > 5) {
        return res.status(400).json({ success: false, message: 'study_year must be between 1 and 5' });
      }
      updates.study_year = yr;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('student_profiles')
      .update(updates)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: normaliseStudentProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/profiles/company ────────────────────────────────────────────────
exports.updateCompany = async (req, res, next) => {
  try {
    const fieldMap = {
      companyName: 'company_name', sector: 'sector', description: 'description',
      city: 'city', address: 'address', phone: 'phone',
      websiteUrl: 'website_url', logoUrl: 'logo_url', employeeSize: 'employee_size',
    };

    const updates = {};
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .update(updates)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: normaliseCompanyProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/profiles/student/:id ─────────────────────────────────────────────
// :id is the profiles.id (auth user UUID)
exports.getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('student_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, data: normaliseStudentProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/profiles/company/:id ─────────────────────────────────────────────
// :id is the profiles.id (auth user UUID)
exports.getCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.json({ success: true, data: normaliseCompanyProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/companies/:id (public — by company_profiles row ID) ─────────────
exports.getCompanyPublic = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: cp, error } = await supabaseAdmin
      .from('company_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !cp) return res.status(404).json({ success: false, message: 'Company not found' });

    // Active open internships
    const { data: offers } = await supabaseAdmin
      .from('internship_offers')
      .select('id, title, domain, location, duration_weeks, is_paid, stipend_amount, stipend_currency, openings, deadline, status, created_at')
      .eq('company_id', id)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(20);

    // Count all offers (for credibility)
    const { count: totalOffers } = await supabaseAdmin
      .from('internship_offers')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', id);

    const company = normaliseCompanyProfile(cp);

    // Compute company profile completeness
    const fields  = [cp.company_name, cp.description, cp.website_url, cp.logo_url, cp.sector, cp.city, cp.phone, cp.employee_size];
    const filled  = fields.filter(Boolean).length;
    const profileScore = Math.round((filled / fields.length) * 100);

    res.json({
      success: true,
      data: {
        ...company,
        profileScore,
        openOffers:  (offers || []).map(o => ({
          id:            o.id,
          title:         o.title,
          domain:        o.domain,
          location:      o.location,
          durationWeeks: o.duration_weeks,
          isPaid:        o.is_paid,
          stipendAmount: o.stipend_amount,
          stipendCurrency: o.stipend_currency,
          openings:      o.openings,
          deadline:      o.deadline,
          createdAt:     o.created_at,
        })),
        totalOffersEver: totalOffers || 0,
      },
    });
  } catch (err) { next(err); }
};

// ── GET /api/companies (public — paginated company directory) ─────────────────
exports.listCompanies = async (req, res, next) => {
  try {
    const search   = (req.query.search   || '').trim();
    const sector   = (req.query.sector   || '').trim();
    const city     = (req.query.city     || '').trim();
    const page     = Math.max(1, parseInt(req.query.page) || 1);
    const limit    = Math.min(24, Math.max(1, parseInt(req.query.limit) || 12));
    const from     = (page - 1) * limit;

    let query = supabaseAdmin
      .from('company_profiles')
      .select('id, user_id, company_name, sector, city, description, logo_url, website_url, is_verified', { count: 'exact' })
      .range(from, from + limit - 1)
      .order('company_name', { ascending: true });

    if (search)  query = query.ilike('company_name', `%${search}%`);
    if (sector)  query = query.eq('sector', sector);
    if (city)    query = query.eq('city', city);
    if (req.query.verified === 'true') query = query.eq('is_verified', true);

    const { data: companies, error, count } = await query;
    if (error) throw error;

    // Batch fetch open offer counts
    const ids = (companies || []).map(c => c.id);
    let openCountMap = {};
    if (ids.length) {
      const { data: offerCounts } = await supabaseAdmin
        .from('internship_offers')
        .select('company_id')
        .in('company_id', ids)
        .eq('status', 'open');
      for (const row of (offerCounts || [])) {
        openCountMap[row.company_id] = (openCountMap[row.company_id] || 0) + 1;
      }
    }

    res.json({
      success: true,
      data: {
        companies: (companies || []).map(c => ({
          id:          c.id,
          userId:      c.user_id,
          companyName: c.company_name,
          sector:      c.sector,
          city:        c.city,
          description: c.description,
          logoUrl:     c.logo_url,
          websiteUrl:  c.website_url,
          isVerified:  c.is_verified ?? false,
          openOffers:  openCountMap[c.id] || 0,
        })),
        total: count || 0,
        page,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) { next(err); }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function computeProfileCompletion(p) {
  let score = 0;
  if (p.first_name && p.last_name)                score += 10;
  if (p.university)                               score += 10;
  if (p.programme)                                score += 10;
  if (p.study_year)                               score += 5;
  if (p.cv_url)                                   score += 25;
  if (p.skills && p.skills.length >= 3)           score += 15;
  if (p.bio)                                      score += 10;
  if (p.avatar_url)                               score += 5;
  if (p.linkedin_url || p.github_url)             score += 5;
  if (p.phone)                                    score += 5;
  return score;
}

function computeCompletionTips(p) {
  const tips = [];
  if (!p.cv_url)
    tips.push({ field: 'cv',      message: 'Upload your CV',              points: 25 });
  if (!p.skills || p.skills.length < 3)
    tips.push({ field: 'skills',  message: 'Add at least 3 skills',       points: 15 });
  if (!p.bio)
    tips.push({ field: 'bio',     message: 'Write a short bio',           points: 10 });
  if (!p.avatar_url)
    tips.push({ field: 'avatar',  message: 'Add a profile photo',         points: 5  });
  if (!p.phone)
    tips.push({ field: 'phone',   message: 'Add your phone number',       points: 5  });
  if (!p.linkedin_url && !p.github_url)
    tips.push({ field: 'links',   message: 'Add LinkedIn or GitHub link', points: 5  });
  return tips.sort((a, b) => b.points - a.points);
}

function normaliseStudentProfile(p) {
  if (!p) return p;
  return {
    id:               p.id,
    userId:           p.user_id,
    firstName:        p.first_name,
    lastName:         p.last_name,
    phone:            p.phone,
    university:       p.university,
    faculty:          p.faculty,
    programme:        p.programme,
    studyYear:        p.study_year,
    bio:              p.bio,
    skills:           p.skills,
    languages:        p.languages,
    // ai_summary is extraction/display metadata only (summary, education,
    // experience, parsing method). Skills/languages live in their own columns
    // and are the single source of truth — strip them here defensively so no
    // stale blob copy can ever reach the client.
    aiSummary:        p.ai_summary
      ? (({ skills, languages, ...narrative }) => narrative)(p.ai_summary)
      : null,
    city:             p.city,
    cvUrl:            p.cv_url,
    avatarUrl:        p.avatar_url,
    linkedinUrl:      p.linkedin_url,
    githubUrl:        p.github_url,
    completionScore:  computeProfileCompletion(p),
    completionTips:   computeCompletionTips(p),
    createdAt:        p.created_at,
    updatedAt:        p.updated_at,
  };
}

function normaliseCompanyProfile(p) {
  if (!p) return p;
  return {
    id:           p.id,
    userId:       p.user_id,
    companyName:  p.company_name,
    sector:       p.sector,
    description:  p.description,
    city:         p.city,
    address:      p.address,
    phone:        p.phone,
    websiteUrl:   p.website_url,
    logoUrl:      p.logo_url,
    employeeSize: p.employee_size,
    isVerified:   p.is_verified ?? false,
    verifiedAt:   p.verified_at,
    createdAt:    p.created_at,
    updatedAt:    p.updated_at,
  };
}

exports.normaliseStudentProfile = normaliseStudentProfile;
exports.normaliseCompanyProfile  = normaliseCompanyProfile;

// ── GET /api/profiles/preferences ─────────────────────────────────────────────
exports.getPreferences = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { data } = await supabaseAdmin
      .from('notification_preferences')
      .select('offer_alerts, email_alerts, min_match_score')
      .eq('user_id', userId)
      .maybeSingle();

    // No row = user hasn't saved prefs yet; return defaults
    res.json({
      success: true,
      data: {
        offerAlerts:   data?.offer_alerts   ?? true,
        emailAlerts:   data?.email_alerts   ?? false,
        minMatchScore: data?.min_match_score ?? 50,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/profiles/preferences ───────────────────────────────────────────
exports.updatePreferences = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { offerAlerts, emailAlerts, minMatchScore } = req.body;

    const row = { user_id: userId, updated_at: new Date().toISOString() };
    if (offerAlerts   !== undefined) row.offer_alerts    = Boolean(offerAlerts);
    if (emailAlerts   !== undefined) row.email_alerts    = Boolean(emailAlerts);
    if (minMatchScore !== undefined) row.min_match_score = Math.min(100, Math.max(0, Number(minMatchScore)));

    const { data, error } = await supabaseAdmin
      .from('notification_preferences')
      .upsert(row, { onConflict: 'user_id' })
      .select('offer_alerts, email_alerts, min_match_score')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: {
        offerAlerts:   data.offer_alerts,
        emailAlerts:   data.email_alerts,
        minMatchScore: data.min_match_score,
      },
    });
  } catch (err) {
    next(err);
  }
};
