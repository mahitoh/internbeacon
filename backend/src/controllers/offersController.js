const { supabaseAdmin } = require('../config/supabase');
const { computeRecommendationReasons, computeMatch } = require('../utils/matchingEngine');
const { fireOfferAlerts } = require('../utils/offerAlerts');

async function getStudentProfile(userId) {
  const { data } = await supabaseAdmin
    .from('student_profiles')
    .select('skills, ai_summary, programme, faculty, city, study_year, languages')
    .eq('user_id', userId)
    .single();
  return data || null;
}

// ── GET /api/offers ────────────────────────────────────────────────────────────
exports.list = async (req, res, next) => {
  try {
    const { domain, location, search, page = 1, limit = 20, status = 'open' } = req.query;

    let query = supabaseAdmin
      .from('internship_offers')
      .select(`
        id, title, domain, location, duration_weeks, is_paid, stipend_amount,
        stipend_currency, openings, deadline, start_date, status, views_count, created_at,
        required_skills, requirements,
        company_profiles ( id, company_name, sector, city, logo_url, is_verified )
      `, { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (domain)   query = query.eq('domain', domain);
    if (location) query = query.ilike('location', `%${location}%`);
    if (req.query.paid === 'true') query = query.eq('is_paid', true);
    if (search) {
      const { data: matchingCompanies } = await supabaseAdmin
        .from('company_profiles')
        .select('id')
        .ilike('company_name', `%${search}%`);
      const companyIds = (matchingCompanies || []).map(c => c.id);

      let filter = `title.ilike.%${search}%,description.ilike.%${search}%`;
      if (companyIds.length > 0) filter += `,company_id.in.(${companyIds.join(',')})`;
      query = query.or(filter);
    }

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Compute match scores for authenticated students in one pass
    let studentProfile = null;
    if (req.user?.role === 'student') {
      studentProfile = await getStudentProfile(req.user.userId);
    }

    const offers = data.map(o => {
      const normalised = normaliseOffer(o);
      if (studentProfile) {
        const result = computeMatch(studentProfile, o);
        normalised.match = { score: result.score, verdict: result.verdict, breakdown: result.breakdown };
      }
      return normalised;
    });

    res.json({
      success: true,
      data: offers,
      meta: { total: count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/offers/:id ────────────────────────────────────────────────────────
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('internship_offers')
      .select(`
        *,
        company_profiles ( * )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    // Increment views (fire-and-forget)
    supabaseAdmin
      .from('internship_offers')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id)
      .then(() => {});

    const normalised = normaliseOffer(data);
    if (req.user?.role === 'student') {
      const sp = await getStudentProfile(req.user.userId);
      if (sp) normalised.match = computeMatch(sp, data);
    }
    res.json({ success: true, data: normalised });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/offers ───────────────────────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    // company_id in internship_offers = company_profiles.id (NOT profiles.id)
    const { data: cp, error: cpErr } = await supabaseAdmin
      .from('company_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    if (cpErr || !cp) {
      return res.status(400).json({ success: false, message: 'Company profile not found' });
    }

    const {
      title, description, responsibilities, requirements, domain, location,
      durationWeeks, isPaid, stipendAmount, stipendCurrency,
      openings, startDate, deadline, requiredSkills, status = 'open',
    } = req.body;

    // Only include optional fields when provided — don't override DB defaults with null
    const payload = {
      company_id:    cp.id,
      title,
      description,
      domain,
      location,
      duration_weeks: Number(durationWeeks),
      deadline,
      required_skills: requiredSkills || [],
      status,
    };
    if (responsibilities !== undefined)  payload.responsibilities   = responsibilities;
    if (requirements !== undefined)      payload.requirements       = requirements;
    if (isPaid !== undefined)            payload.is_paid            = isPaid;
    if (stipendAmount !== undefined)     payload.stipend_amount     = Number(stipendAmount);
    if (stipendCurrency !== undefined)   payload.stipend_currency   = stipendCurrency;
    if (openings !== undefined)          payload.openings           = Number(openings);
    if (startDate !== undefined)         payload.start_date         = startDate;

    const { data, error } = await supabaseAdmin
      .from('internship_offers')
      .insert(payload)
      .select(`*, company_profiles ( * )`)
      .single();

    if (error) throw error;

    if (data.status === 'open') fireOfferAlerts(data);

    res.status(201).json({ success: true, data: normaliseOffer(data) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/offers/:id ──────────────────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership via company_profiles
    const { data: cp } = await supabaseAdmin
      .from('company_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    const { data: existing } = await supabaseAdmin
      .from('internship_offers')
      .select('company_id, status')
      .eq('id', id)
      .single();

    if (!existing) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (!cp || existing.company_id !== cp.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const fieldMap = {
      title: 'title', description: 'description', responsibilities: 'responsibilities',
      requirements: 'requirements', domain: 'domain', location: 'location',
      durationWeeks: 'duration_weeks', isPaid: 'is_paid',
      stipendAmount: 'stipend_amount', stipendCurrency: 'stipend_currency',
      openings: 'openings', startDate: 'start_date', deadline: 'deadline',
      requiredSkills: 'required_skills', status: 'status',
    };

    const updates = {};
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
    }

    if (updates.duration_weeks !== undefined) updates.duration_weeks = Number(updates.duration_weeks);
    if (updates.stipend_amount !== undefined) updates.stipend_amount = Number(updates.stipend_amount);
    if (updates.openings !== undefined) updates.openings = Number(updates.openings);

    const { data, error } = await supabaseAdmin
      .from('internship_offers')
      .update(updates)
      .eq('id', id)
      .select(`*, company_profiles ( * )`)
      .single();

    if (error) throw error;

    // Fire alerts when a draft is published (status transitions to open)
    if (updates.status === 'open' && existing.status !== 'open') fireOfferAlerts(data);

    res.json({ success: true, data: normaliseOffer(data) });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/offers/:id ─────────────────────────────────────────────────────
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: cp } = await supabaseAdmin
      .from('company_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    const { data: existing } = await supabaseAdmin
      .from('internship_offers')
      .select('company_id')
      .eq('id', id)
      .single();

    if (!existing) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (!cp || existing.company_id !== cp.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { error } = await supabaseAdmin.from('internship_offers').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Offer deleted' });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/offers/:id/bookmark ──────────────────────────────────────────────
exports.bookmark = async (req, res, next) => {
  try {
    const { id: offerId } = req.params;

    // offer_bookmarks.student_id → student_profiles.id
    const { data: sp } = await supabaseAdmin
      .from('student_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    if (!sp) return res.status(400).json({ success: false, message: 'Student profile not found' });

    const { error } = await supabaseAdmin
      .from('offer_bookmarks')
      .insert({ student_id: sp.id, offer_id: offerId });

    if (error) {
      if (error.code === '23505') return res.status(409).json({ success: false, message: 'Already bookmarked' });
      throw error;
    }

    res.status(201).json({ success: true, message: 'Bookmarked' });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/offers/:id/bookmark ───────────────────────────────────────────
exports.unbookmark = async (req, res, next) => {
  try {
    const { id: offerId } = req.params;

    const { data: sp } = await supabaseAdmin
      .from('student_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    if (!sp) return res.status(400).json({ success: false, message: 'Student profile not found' });

    const { error } = await supabaseAdmin
      .from('offer_bookmarks')
      .delete()
      .eq('student_id', sp.id)
      .eq('offer_id', offerId);

    if (error) throw error;

    res.json({ success: true, message: 'Bookmark removed' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/offers/bookmarks ──────────────────────────────────────────────────
exports.listBookmarks = async (req, res, next) => {
  try {
    const { data: sp } = await supabaseAdmin
      .from('student_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    if (!sp) return res.status(400).json({ success: false, message: 'Student profile not found' });

    const { data, error } = await supabaseAdmin
      .from('offer_bookmarks')
      .select(`
        created_at,
        internship_offers (
          id, title, domain, location, deadline, status, duration_weeks,
          is_paid, stipend_amount, stipend_currency, openings,
          company_profiles ( id, company_name, sector, city, logo_url, is_verified )
        )
      `)
      .eq('student_id', sp.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: (data || []).map(b => ({
        ...normaliseOffer(b.internship_offers),
        savedAt: b.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/offers/my ─────────────────────────────────────────────────────────
exports.myOffers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const { data: cp } = await supabaseAdmin
      .from('company_profiles')
      .select('id')
      .eq('user_id', req.user.userId)
      .single();

    if (!cp) return res.status(400).json({ success: false, message: 'Company profile not found' });

    let query = supabaseAdmin
      .from('internship_offers')
      .select(`
        id, title, domain, location, duration_weeks, is_paid, stipend_amount,
        stipend_currency, openings, filled_count, deadline, start_date, status, views_count, created_at,
        company_profiles ( id, company_name, sector, city, logo_url, is_verified )
      `, { count: 'exact' })
      .eq('company_id', cp.id)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data: data.map(normaliseOffer),
      meta: { total: count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/offers/recommended ───────────────────────────────────────────────
exports.recommended = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const { data: sp } = await supabaseAdmin
      .from('student_profiles')
      .select('id, skills, programme, faculty, study_year, languages, ai_summary')
      .eq('user_id', req.user.userId)
      .single();

    if (!sp) return res.status(400).json({ success: false, message: 'Student profile not found' });

    // Get already-applied offer IDs so we don't recommend those
    const { data: applied } = await supabaseAdmin
      .from('applications')
      .select('offer_id, internship_offers(domain)')
      .eq('student_id', sp.id);
    const appliedIds     = (applied || []).map(a => a.offer_id);
    const appliedDomains = [...new Set((applied || []).map(a => a.internship_offers?.domain).filter(Boolean))];

    // Build candidate pool: open offers, excluding already applied, domain-biased
    let query = supabaseAdmin
      .from('internship_offers')
      .select(`
        id, title, domain, location, duration_weeks, is_paid, stipend_amount,
        stipend_currency, openings, deadline, start_date, status, views_count,
        required_skills, requirements, description, created_at,
        company_profiles ( id, company_name, sector, city, logo_url, is_verified )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(60); // candidate pool

    if (appliedIds.length > 0) query = query.not('id', 'in', `(${appliedIds.join(',')})`);

    const { data: pool } = await query;
    if (!pool?.length) return res.json({ success: true, data: [] });

    // Score every candidate and attach reasons
    const scored = pool.map(offer => {
      const match = computeRecommendationReasons(sp, offer);
      return {
        ...normaliseOffer(offer),
        matchScore:     match.score,
        matchReasons:   match.reasons,
        matchVerdict:   match.verdict,
        matchBreakdown: match.breakdown,
        matchMethod:    match.method,
      };
    });

    // Sort by score desc, take top N
    scored.sort((a, b) => b.matchScore - a.matchScore);
    const top = scored.slice(0, Number(limit));

    res.json({ success: true, data: top });
  } catch (err) { next(err); }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function normaliseOffer(o) {
  if (!o) return o;
  const { company_profiles: cp, ...rest } = o;
  return {
    id:              rest.id,
    title:           rest.title,
    description:     rest.description,
    responsibilities: rest.responsibilities,
    requirements:    rest.requirements,
    domain:          rest.domain,
    location:        rest.location,
    durationWeeks:   rest.duration_weeks,
    isPaid:          rest.is_paid,
    stipendAmount:   rest.stipend_amount,
    stipendCurrency: rest.stipend_currency,
    openings:        rest.openings,
    startDate:       rest.start_date,
    deadline:        rest.deadline,
    requiredSkills:  rest.required_skills,
    status:          rest.status,
    viewsCount:      rest.views_count,
    filledCount:     rest.filled_count ?? 0,
    createdAt:       rest.created_at,
    updatedAt:       rest.updated_at,
    companyId:       rest.company_id,
    company: cp ? {
      id:          cp.id,
      companyName: cp.company_name,
      sector:      cp.sector,
      city:        cp.city,
      logoUrl:     cp.logo_url,
      websiteUrl:  cp.website_url,
      isVerified:  cp.is_verified ?? false,
    } : undefined,
  };
}
