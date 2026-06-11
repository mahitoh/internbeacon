const { supabaseAdmin } = require('../config/supabase');
const { notify }        = require('../utils/notifier');

// ── GET /api/admin/stats ───────────────────────────────────────────────────────
exports.stats = async (req, res, next) => {
  try {
    const [
      { count: totalStudents },
      { count: totalCompanies },
      { count: totalAdmins },
      { count: openOffers },
      { count: closedOffers },
      { count: draftOffers },
      { count: submittedApps },
      { count: reviewingApps },
      { count: acceptedApps },
      { count: rejectedApps },
      { count: totalApps },
      { count: totalMessages },
      { data: recentUsers },
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'company'),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
      supabaseAdmin.from('internship_offers').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabaseAdmin.from('internship_offers').select('id', { count: 'exact', head: true }).eq('status', 'closed'),
      supabaseAdmin.from('internship_offers').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabaseAdmin.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
      supabaseAdmin.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'under_review'),
      supabaseAdmin.from('applications').select('id', { count: 'exact', head: true }).in('status', ['accepted', 'offer_accepted']),
      supabaseAdmin.from('applications').select('id', { count: 'exact', head: true }).in('status', ['rejected', 'withdrawn', 'offer_declined']),
      supabaseAdmin.from('applications').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('messages').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles')
        .select('id, role, created_at, student_profiles(first_name, last_name), company_profiles(company_name)')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          students:  totalStudents,
          companies: totalCompanies,
          admins:    totalAdmins,
          total:     (totalStudents || 0) + (totalCompanies || 0) + (totalAdmins || 0),
        },
        offers: {
          open:   openOffers,
          closed: closedOffers,
          draft:  draftOffers,
          total:  (openOffers || 0) + (closedOffers || 0) + (draftOffers || 0),
        },
        applications: {
          pending:   submittedApps,
          reviewing: reviewingApps,
          accepted:  acceptedApps,
          rejected:  rejectedApps,
          total:     totalApps,
        },
        messages:    totalMessages,
        recentUsers: recentUsers || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/trends ─────────────────────────────────────────────────────
exports.trends = async (req, res, next) => {
  try {
    const days  = Math.min(Number(req.query.days) || 30, 90);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [{ data: signups }, { data: applications }] = await Promise.all([
      supabaseAdmin.from('profiles').select('created_at').gte('created_at', since),
      supabaseAdmin.from('applications').select('applied_at').gte('applied_at', since),
    ]);

    // Build a day-keyed map over the requested range
    const dayMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      dayMap[d.toISOString().slice(0, 10)] = { date: d.toISOString().slice(0, 10), signups: 0, applications: 0 };
    }

    (signups || []).forEach(r => {
      const key = r.created_at.slice(0, 10);
      if (dayMap[key]) dayMap[key].signups++;
    });
    (applications || []).forEach(r => {
      const key = r.applied_at.slice(0, 10);
      if (dayMap[key]) dayMap[key].applications++;
    });

    res.json({ success: true, data: Object.values(dayMap) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/users ───────────────────────────────────────────────────────
exports.listUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 20, search } = req.query;

    let query = supabaseAdmin
      .from('profiles')
      .select(`
        id, role, is_active, created_at, updated_at,
        student_profiles ( first_name, last_name, university, programme ),
        company_profiles ( company_name, sector, city, is_verified )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (role)     query = query.eq('role', role);
    if (isActive !== undefined) query = query.eq('is_active', isActive === 'true');

    // When search is active, skip pagination — email search requires post-join filtering
    // across the full dataset (PostgREST can't query auth.users).
    if (!search) {
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // Fetch emails from Supabase Auth (service role can list users)
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const emailMap = {};
    (authData?.users || []).forEach(u => { emailMap[u.id] = u.email; });

    const users = data.map(p => ({
      id:             p.id,
      email:          emailMap[p.id] || null,
      role:           p.role,
      isActive:       p.is_active,
      createdAt:      p.created_at,
      updatedAt:      p.updated_at,
      studentProfile: p.student_profiles,
      companyProfile: p.company_profiles ? {
        ...p.company_profiles,
        isVerified: p.company_profiles.is_verified,
      } : null,
    }));

    const q = search?.toLowerCase();
    const filtered = q
      ? users.filter(u =>
          u.email?.toLowerCase().includes(q) ||
          u.studentProfile?.first_name?.toLowerCase().includes(q) ||
          u.studentProfile?.last_name?.toLowerCase().includes(q) ||
          u.companyProfile?.company_name?.toLowerCase().includes(q)
        )
      : users;

    res.json({
      success: true,
      data: filtered,
      meta: { total: q ? filtered.length : count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/users/:id ───────────────────────────────────────────────────
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [{ data: profile }, { data: authUser }] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('*, student_profiles(*), company_profiles(*)')
        .eq('id', id)
        .single(),
      supabaseAdmin.auth.admin.getUserById(id),
    ]);

    if (!profile) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        id:             profile.id,
        email:          authUser.user?.email,
        role:           profile.role,
        isActive:       profile.is_active,
        emailConfirmed: !!authUser.user?.email_confirmed_at,
        createdAt:      profile.created_at,
        lastSignIn:     authUser.user?.last_sign_in_at,
        studentProfile: profile.student_profiles,
        companyProfile: profile.company_profiles,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/users/:id/activate ───────────────────────────────────────
exports.setActive = async (req, res, next) => {
  try {
    const { id }       = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }
    if (id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot change your own active status' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'User not found' });

    // Also ban/unban in Supabase Auth so they can't log in
    await supabaseAdmin.auth.admin.updateUserById(id, {
      ban_duration: isActive ? 'none' : '876600h', // ~100 years = effectively permanent
    });

    res.json({ success: true, data: { id: data.id, isActive: data.is_active } });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/users/:id/role ───────────────────────────────────────────
exports.setRole = async (req, res, next) => {
  try {
    const { id }   = req.params;
    const { role } = req.body;

    if (!['student', 'company', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be student, company, or admin' });
    }
    if (id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    // Update profiles table and Supabase Auth metadata simultaneously
    const [{ data, error }] = await Promise.all([
      supabaseAdmin.from('profiles').update({ role }).eq('id', id).select().single(),
      supabaseAdmin.auth.admin.updateUserById(id, {
        app_metadata: { role },
        user_metadata: { role },
      }),
    ]);

    if (error || !data) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: { id: data.id, role: data.role } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    // Delete Supabase Auth user — cascades to public.profiles via FK
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      if (error.message?.includes('not found')) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      throw error;
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/offers ──────────────────────────────────────────────────────
exports.listOffers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabaseAdmin
      .from('internship_offers')
      .select(`
        id, title, domain, location, status, views_count, created_at,
        company_profiles ( id, company_name, sector, city )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data, meta: { total: count, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/offers/:id/status ────────────────────────────────────────
exports.setOfferStatus = async (req, res, next) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const VALID = ['draft', 'open', 'closed'];
    if (!VALID.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be draft, open, or closed' });
    }

    const { data, error } = await supabaseAdmin
      .from('internship_offers')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Offer not found' });

    res.json({ success: true, data: { id: data.id, status: data.status } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/admin/offers/:id ──────────────────────────────────────────────
exports.deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.from('internship_offers').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Offer deleted' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/applications ───────────────────────────────────────────────
exports.listApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabaseAdmin
      .from('applications')
      .select(`
        id, status, applied_at,
        internship_offers ( id, title, company_profiles ( company_name ) ),
        student_profiles ( first_name, last_name, university )
      `, { count: 'exact' })
      .order('applied_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data, meta: { total: count, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/notifications/broadcast ───────────────────────────────────
// Send a system notification to all users, or filtered by role
exports.broadcast = async (req, res, next) => {
  try {
    const { title, body, link, role } = req.body;

    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }

    // Get target user IDs
    let query = supabaseAdmin.from('profiles').select('id');
    if (role && ['student', 'company', 'admin'].includes(role)) {
      query = query.eq('role', role);
    }

    const { data: targets, error: targetsErr } = await query;
    if (targetsErr) throw targetsErr;

    if (!targets || targets.length === 0) {
      return res.json({ success: true, message: 'No users to notify', sent: 0 });
    }

    // Batch insert notifications
    const rows = targets.map(t => ({
      user_id: t.id,
      type:    'system',
      title:   title.trim(),
      body:    body.trim(),
      link:    link || null,
    }));

    const { error: insertErr } = await supabaseAdmin.from('notifications').insert(rows);
    if (insertErr) throw insertErr;

    // Push real-time notifications to connected users
    const { emitNotification } = require('../socket');
    rows.forEach(r => emitNotification(r.user_id, { ...r, isRead: false }));

    res.json({ success: true, message: `Broadcast sent to ${targets.length} user(s)`, sent: targets.length });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/companies/:id/verify ─────────────────────────────────────
exports.verifyCompany = async (req, res, next) => {
  try {
    const { id }         = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isVerified must be a boolean' });
    }

    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .update({
        is_verified: isVerified,
        verified_at: isVerified ? new Date().toISOString() : null,
      })
      .eq('user_id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    if (isVerified) {
      notify({
        userId: id,
        type:   'system',
        title:  '✓ Company Verified',
        body:   'Your company has been verified by InternBeacon. A verified badge now appears on your profile.',
        link:   '/company/profile',
      });
    }

    res.json({ success: true, data: { id: data.id, isVerified: data.is_verified } });
  } catch (err) {
    next(err);
  }
};
