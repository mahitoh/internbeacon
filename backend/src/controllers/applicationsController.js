const { supabaseAdmin } = require('../config/supabase');
const { notify }        = require('../utils/notifier');
const { sendMail, newApplicationEmail, statusUpdateEmail, interviewEmail, offerResponseEmail } = require('../utils/mailer');

const STATUS_META = {
  submitted:           { emoji: '📬', title: 'Application submitted',              body: s => `Your application to "${s}" has been submitted.` },
  under_review:        { emoji: '👀', title: 'Application under review',           body: s => `Your application to "${s}" is now being reviewed.` },
  shortlisted:         { emoji: '⭐', title: 'You\'ve been shortlisted!',           body: s => `Great news! You've been shortlisted for "${s}".` },
  interview_scheduled: { emoji: '📅', title: 'Interview scheduled',                body: s => `An interview has been scheduled for "${s}". Check your application for details.` },
  interview_completed: { emoji: '🤝', title: 'Interview completed',                body: s => `Your interview for "${s}" has been marked as completed.` },
  final_review:        { emoji: '🔍', title: 'In final review',                    body: s => `Your application to "${s}" is in final review.` },
  accepted:            { emoji: '🎉', title: 'Congratulations! You got the role!', body: s => `Your application to "${s}" has been accepted!` },
  rejected:            { emoji: '📋', title: 'Application not selected',            body: s => `The company has made a decision on "${s}".` },
  offer_accepted:      { emoji: '🤝', title: 'Offer accepted',                     body: s => `The student has accepted the offer for "${s}".` },
  offer_declined:      { emoji: '↩',  title: 'Offer declined',                     body: s => `The student has declined the offer for "${s}".` },
};

async function addHistory(applicationId, status, userId, notes) {
  try {
    await supabaseAdmin.from('application_status_history').insert({
      application_id: applicationId,
      status,
      changed_by: userId || null,
      notes:      notes  || null,
    });
  } catch (err) {
    console.warn('[HISTORY] Failed to record status history:', err.message);
  }
}

// ── POST /api/applications ────────────────────────────────────────────────────
exports.apply = async (req, res, next) => {
  try {
    const { offerId, coverLetter, cvSnapshotUrl } = req.body;

    const { data: sp } = await supabaseAdmin
      .from('student_profiles')
      .select('id, first_name, last_name, cv_url')
      .eq('user_id', req.user.userId)
      .single();

    if (!sp) return res.status(400).json({ success: false, message: 'Student profile not found' });

    const { data: offer } = await supabaseAdmin
      .from('internship_offers')
      .select('id, status, deadline, openings, filled_count')
      .eq('id', offerId)
      .single();

    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (offer.status !== 'open')
      return res.status(400).json({ success: false, message: 'This offer is no longer accepting applications' });
    if (offer.deadline && new Date(offer.deadline) < new Date())
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    if (offer.filled_count >= offer.openings)
      return res.status(400).json({ success: false, message: 'All positions for this offer have been filled' });

    // Auto-populate CV snapshot from profile if not supplied
    const resolvedCv = cvSnapshotUrl || sp.cv_url || null;

    // Build profile snapshot — immutable record of who applied and with what profile
    const { data: fullProfile } = await supabaseAdmin
      .from('student_profiles')
      .select('first_name, last_name, university, faculty, programme, study_year, skills, bio, languages, avatar_url, cv_url, linkedin_url, ai_summary')
      .eq('id', sp.id)
      .single();

    const profileSnapshot = fullProfile ? {
      firstName:   fullProfile.first_name,
      lastName:    fullProfile.last_name,
      university:  fullProfile.university,
      faculty:     fullProfile.faculty,
      programme:   fullProfile.programme,
      studyYear:   fullProfile.study_year,
      skills:      fullProfile.skills,
      bio:         fullProfile.bio,
      languages:   fullProfile.languages,
      avatarUrl:   fullProfile.avatar_url,
      cvUrl:       fullProfile.cv_url,
      linkedinUrl: fullProfile.linkedin_url,
      aiSummary:   fullProfile.ai_summary,
      snapshotAt:  new Date().toISOString(),
    } : null;

    const insertPayload = {
      offer_id:        offerId,
      student_id:      sp.id,
      cover_letter:    coverLetter || null,
      cv_snapshot_url: resolvedCv,
      status:          'submitted',
    };
    if (profileSnapshot) insertPayload.profile_snapshot = profileSnapshot;

    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505')
        return res.status(409).json({ success: false, message: 'You have already applied to this offer' });
      throw error;
    }

    // Copy CV to an immutable per-application snapshot so re-uploads don't overwrite the record.
    // Fire-and-forget: a copy failure must never block the application from submitting.
    if (resolvedCv) {
      (async () => {
        try {
          // Namespace the snapshot by the AUTH user id (not student_profiles.id):
          // the CV signed-URL guard authorises by studentUserId and only allows
          // paths under `applications/${studentUserId}/`, so the company viewer 403s
          // if the snapshot is stored under the profile id instead.
          const snapshotPath = `applications/${req.user.userId}/${data.id}.pdf`;
          const { data: fileData, error: dlErr } = await supabaseAdmin.storage
            .from('cvs').download(resolvedCv);
          if (!dlErr && fileData) {
            const buffer = Buffer.from(await fileData.arrayBuffer());
            const { error: upErr } = await supabaseAdmin.storage
              .from('cvs')
              .upload(snapshotPath, buffer, { contentType: 'application/pdf', upsert: false });
            if (!upErr) {
              await supabaseAdmin.from('applications')
                .update({ cv_snapshot_url: snapshotPath })
                .eq('id', data.id);
            }
          }
        } catch (_) { /* non-blocking */ }
      })();
    }

    await addHistory(data.id, 'submitted', req.user.userId, null);

    const { data: fullOffer } = await supabaseAdmin
      .from('internship_offers')
      .select('title, company_profiles ( user_id, company_name )')
      .eq('id', offerId)
      .single();

    if (fullOffer?.company_profiles?.user_id) {
      const companyUserId = fullOffer.company_profiles.user_id;
      notify({
        userId: companyUserId,
        type:   'new_application',
        title:  'New application received',
        body:   `${[sp.first_name, sp.last_name].filter(Boolean).join(' ') || 'A student'} applied to "${fullOffer.title}"`,
        link:   `/company/applications/${data.id}`,
      });

      supabaseAdmin.auth.admin.getUserById(companyUserId).then(({ data: au }) => {
        const email = au?.user?.email;
        if (email) sendMail({
          to: email,
          subject: `New application for "${fullOffer.title}" — InternBeacon`,
          html: newApplicationEmail({
            companyName:   fullOffer.company_profiles.company_name || 'there',
            studentName:   [sp.first_name, sp.last_name].filter(Boolean).join(' ') || 'A student',
            offerTitle:    fullOffer.title,
            applicationId: data.id,
          }),
        });
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: normaliseApplication(data) });
  } catch (err) { next(err); }
};

// ── GET /api/applications/my ──────────────────────────────────────────────────
exports.myApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const { data: sp } = await supabaseAdmin
      .from('student_profiles').select('id').eq('user_id', req.user.userId).single();
    if (!sp) return res.status(400).json({ success: false, message: 'Student profile not found' });

    let query = supabaseAdmin
      .from('applications')
      .select(`
        id, offer_id, status, cover_letter, cv_snapshot_url, company_note, profile_snapshot,
        applied_at, reviewed_at, decided_at,
        interview_date, interview_type, interview_location, interview_link, interview_notes,
        internship_offers (
          id, title, domain, location, deadline, status,
          company_profiles ( company_name, sector, city, logo_url )
        )
      `, { count: 'exact' })
      .eq('student_id', sp.id)
      .order('applied_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data: data.map(a => normaliseApplication(a)), meta: { total: count, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

// ── GET /api/applications/offer/:offerId ──────────────────────────────────────
exports.offerApplications = async (req, res, next) => {
  try {
    const { offerId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const { data: cp } = await supabaseAdmin
      .from('company_profiles').select('id').eq('user_id', req.user.userId).single();

    const { data: offer } = await supabaseAdmin
      .from('internship_offers').select('company_id').eq('id', offerId).single();

    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (!cp || offer.company_id !== cp.id)
      return res.status(403).json({ success: false, message: 'Access denied' });

    let query = supabaseAdmin
      .from('applications')
      .select(`
        id, status, cover_letter, cv_snapshot_url, company_note, internal_note, profile_snapshot,
        applied_at, reviewed_at, decided_at,
        interview_date, interview_type, interview_location, interview_link, interview_notes,
        student_profiles (
          id, user_id, first_name, last_name, university, faculty, programme,
          study_year, skills, avatar_url, cv_url, linkedin_url
        )
      `, { count: 'exact' })
      .eq('offer_id', offerId)
      .order('applied_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data: data.map(a => normaliseApplication(a, { showInternal: true })), meta: { total: count, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

// ── PATCH /api/applications/:id/status ───────────────────────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      status, companyNote, internalNote,
      interviewDate, interviewType, interviewLocation, interviewLink, interviewNotes,
    } = req.body;

    const { data: cp } = await supabaseAdmin
      .from('company_profiles').select('id').eq('user_id', req.user.userId).single();

    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('id, status, offer_id, internship_offers ( id, title, company_id, openings, filled_count )')
      .eq('id', id)
      .single();

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (!cp || app.internship_offers.company_id !== cp.id)
      return res.status(403).json({ success: false, message: 'Access denied' });
    if (['withdrawn', 'offer_accepted', 'offer_declined'].includes(app.status))
      return res.status(400).json({ success: false, message: 'Cannot update this application' });

    // Guard: cannot accept more candidates than openings
    if (status === 'accepted') {
      const { filled_count, openings } = app.internship_offers;
      if (filled_count >= openings) {
        return res.status(400).json({
          success: false,
          message: `All ${openings} position${openings !== 1 ? 's' : ''} for this offer have been filled`,
        });
      }
    }

    const updates = { status };
    if (companyNote  !== undefined) updates.company_note   = companyNote;
    if (internalNote !== undefined) updates.internal_note  = internalNote;

    if (['under_review'].includes(status)) updates.reviewed_at = new Date().toISOString();
    if (['accepted', 'rejected'].includes(status)) updates.decided_at = new Date().toISOString();

    if (status === 'interview_scheduled') {
      if (interviewDate)     updates.interview_date     = interviewDate;
      if (interviewType)     updates.interview_type     = interviewType;
      if (interviewLocation) updates.interview_location = interviewLocation;
      if (interviewLink) {
        // Store an absolute URL so the student-side link is a real external link,
        // not a relative path the SPA tries (and fails) to route to.
        const u = String(interviewLink).trim();
        updates.interview_link = /^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : `https://${u}`;
      }
      if (interviewNotes)    updates.interview_notes    = interviewNotes;
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await addHistory(id, status, req.user.userId, internalNote || null);

    const { data: appFull } = await supabaseAdmin
      .from('applications')
      .select(`
        interview_date, interview_type, interview_location, interview_link, interview_notes,
        student_profiles ( user_id, first_name, last_name ),
        internship_offers ( title )
      `)
      .eq('id', id)
      .single();

    if (appFull?.student_profiles?.user_id) {
      const studentUserId = appFull.student_profiles.user_id;
      const offerTitle    = appFull.internship_offers?.title || '';
      const meta          = STATUS_META[status];

      notify({
        userId: studentUserId,
        type:   'status_update',
        title:  meta?.title || 'Application updated',
        body:   meta?.body(offerTitle) || `Status for "${offerTitle}": ${status}`,
        link:   `/student/applications`,
      });

      supabaseAdmin.auth.admin.getUserById(studentUserId).then(({ data: au }) => {
        const email = au?.user?.email;
        if (!email) return;
        const studentName = [appFull.student_profiles.first_name, appFull.student_profiles.last_name]
          .filter(Boolean).join(' ') || 'Student';

        if (status === 'interview_scheduled') {
          sendMail({
            to:      email,
            subject: `Interview scheduled for "${offerTitle}" — InternBeacon`,
            html:    interviewEmail({
              studentName,
              offerTitle,
              interviewDate:     appFull.interview_date,
              interviewType:     appFull.interview_type,
              interviewLocation: appFull.interview_location,
              interviewLink:     appFull.interview_link,
              interviewNotes:    appFull.interview_notes,
            }),
          });
        } else {
          sendMail({
            to:      email,
            subject: `Application update: ${offerTitle} — InternBeacon`,
            html:    statusUpdateEmail({ studentName, offerTitle, status, companyNote: companyNote || null }),
          });
        }
      }).catch(() => {});
    }

    res.json({ success: true, data: normaliseApplication(data, { showInternal: true }) });
  } catch (err) { next(err); }
};

// ── PATCH /api/applications/:id/withdraw ─────────────────────────────────────
exports.withdraw = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: sp } = await supabaseAdmin
      .from('student_profiles').select('id').eq('user_id', req.user.userId).single();

    const { data: app } = await supabaseAdmin
      .from('applications').select('student_id, status').eq('id', id).single();

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (!sp || app.student_id !== sp.id)
      return res.status(403).json({ success: false, message: 'Access denied' });
    if (['accepted', 'rejected', 'withdrawn', 'offer_accepted', 'offer_declined'].includes(app.status))
      return res.status(400).json({ success: false, message: 'Cannot withdraw an application that has already been finalised' });

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ status: 'withdrawn' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await addHistory(id, 'withdrawn', req.user.userId, null);

    res.json({ success: true, data: normaliseApplication(data) });
  } catch (err) { next(err); }
};

// ── PATCH /api/applications/:id/respond ──────────────────────────────────────
// Student accepts or declines an offer after being accepted by the company
exports.respondToOffer = async (req, res, next) => {
  try {
    const { id }       = req.params;
    const { response } = req.body; // 'offer_accepted' | 'offer_declined'

    if (!['offer_accepted', 'offer_declined'].includes(response))
      return res.status(400).json({ success: false, message: 'Response must be offer_accepted or offer_declined' });

    const { data: sp } = await supabaseAdmin
      .from('student_profiles').select('id, first_name, last_name').eq('user_id', req.user.userId).single();

    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('id, status, student_id, offer_id, internship_offers ( id, title, company_profiles ( user_id, company_name ) )')
      .eq('id', id)
      .single();

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (!sp || app.student_id !== sp.id)
      return res.status(403).json({ success: false, message: 'Access denied' });
    if (app.status !== 'accepted')
      return res.status(400).json({ success: false, message: 'You can only respond to an accepted offer' });

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ status: response })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await addHistory(id, response, req.user.userId, null);

    // If accepted: increment filled_count and auto-close offer if full
    if (response === 'offer_accepted') {
      await supabaseAdmin.rpc('increment_offer_filled_count', { offer_id: app.offer_id });
      await supabaseAdmin.rpc('close_offer_if_filled', { offer_id: app.offer_id });
    }

    // Notify and email the company
    const offerTitle    = app.internship_offers?.title || '';
    const companyUserId = app.internship_offers?.company_profiles?.user_id;
    const studentName   = [sp.first_name, sp.last_name].filter(Boolean).join(' ') || 'Student';

    if (companyUserId) {
      const meta = STATUS_META[response];
      notify({
        userId: companyUserId,
        type:   'status_update',
        title:  meta.title,
        body:   meta.body(offerTitle),
        link:   `/company/applications/${id}`,
      });

      supabaseAdmin.auth.admin.getUserById(companyUserId).then(({ data: au }) => {
        const email = au?.user?.email;
        if (email) sendMail({
          to:      email,
          subject: `Offer ${response === 'offer_accepted' ? 'accepted' : 'declined'}: ${offerTitle} — InternBeacon`,
          html:    offerResponseEmail({ studentName, offerTitle, accepted: response === 'offer_accepted', applicationId: id }),
        });
      }).catch(() => {});
    }

    res.json({ success: true, data: normaliseApplication(data) });
  } catch (err) { next(err); }
};

// ── GET /api/applications/company ─────────────────────────────────────────────
exports.companyApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const { data: cp } = await supabaseAdmin
      .from('company_profiles').select('id').eq('user_id', req.user.userId).single();
    if (!cp) return res.status(400).json({ success: false, message: 'Company profile not found' });

    const { data: offerRows } = await supabaseAdmin
      .from('internship_offers').select('id').eq('company_id', cp.id);

    const offerIds = (offerRows || []).map(o => o.id);
    if (!offerIds.length)
      return res.json({ success: true, data: [], meta: { total: 0, page: 1, limit: Number(limit) } });

    let query = supabaseAdmin
      .from('applications')
      .select(`
        id, status, cover_letter, cv_snapshot_url, company_note, internal_note, profile_snapshot,
        applied_at, reviewed_at, decided_at, offer_id,
        interview_date, interview_type,
        internship_offers ( id, title, location ),
        student_profiles ( id, user_id, first_name, last_name, university, programme, study_year, avatar_url, skills )
      `, { count: 'exact' })
      .in('offer_id', offerIds)
      .order('applied_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, data: data.map(a => normaliseApplication(a, { showInternal: true })), meta: { total: count, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

// ── GET /api/applications/:id ─────────────────────────────────────────────────
exports.getOne = async (req, res, next) => {
  try {
    const { id }  = req.params;
    const userId  = req.user.userId;
    const role    = req.user.role;

    const { data: app, error } = await supabaseAdmin
      .from('applications')
      .select(`
        id, status, cover_letter, cv_snapshot_url, company_note, internal_note, profile_snapshot,
        applied_at, reviewed_at, decided_at, offer_id, student_id,
        interview_date, interview_type, interview_location, interview_link, interview_notes,
        internship_offers ( id, title, domain, location, duration_weeks, status,
          company_profiles ( id, user_id, company_name )
        ),
        student_profiles ( id, user_id, first_name, last_name, university, faculty, programme,
          study_year, skills, bio, avatar_url, cv_url, linkedin_url )
      `)
      .eq('id', id)
      .single();

    if (error || !app) return res.status(404).json({ success: false, message: 'Application not found' });

    const isStudent = role === 'student' && app.student_profiles?.user_id === userId;
    const isCompany = role === 'company' && app.internship_offers?.company_profiles?.user_id === userId;

    if (!isStudent && !isCompany)
      return res.status(403).json({ success: false, message: 'Access denied' });

    res.json({ success: true, data: normaliseApplication(app, { showInternal: isCompany }) });
  } catch (err) { next(err); }
};

// ── GET /api/applications/:id/history ────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const { id }  = req.params;
    const userId  = req.user.userId;
    const role    = req.user.role;

    const { data: app } = await supabaseAdmin
      .from('applications')
      .select(`
        student_id, student_profiles ( user_id ),
        internship_offers ( company_profiles ( user_id ) )
      `)
      .eq('id', id)
      .single();

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    const isStudent = role === 'student' && app.student_profiles?.user_id === userId;
    const isCompany = role === 'company' && app.internship_offers?.company_profiles?.user_id === userId;
    const isAdmin   = role === 'admin';

    if (!isStudent && !isCompany && !isAdmin)
      return res.status(403).json({ success: false, message: 'Access denied' });

    const { data: history, error } = await supabaseAdmin
      .from('application_status_history')
      .select('id, status, notes, changed_by, created_at')
      .eq('application_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const result = (history || []).map(h => ({
      id:        h.id,
      status:    h.status,
      notes:     isStudent ? null : h.notes,
      changedBy: h.changed_by,
      createdAt: h.created_at,
    }));

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function normaliseApplication(a, { showInternal = false } = {}) {
  if (!a) return a;
  const rawOffer   = a.internship_offers;
  const rawStudent = a.student_profiles;
  const snap       = a.profile_snapshot; // immutable snapshot from apply()

  const offer = rawOffer ? {
    id:            rawOffer.id,
    title:         rawOffer.title,
    domain:        rawOffer.domain,
    location:      rawOffer.location,
    durationWeeks: rawOffer.duration_weeks,
    deadline:      rawOffer.deadline,
    status:        rawOffer.status,
    company: rawOffer.company_profiles ? {
      id:          rawOffer.company_profiles.id,
      userId:      rawOffer.company_profiles.user_id,
      companyName: rawOffer.company_profiles.company_name,
      sector:      rawOffer.company_profiles.sector,
      city:        rawOffer.company_profiles.city,
      logoUrl:     rawOffer.company_profiles.logo_url,
    } : undefined,
  } : undefined;

  // Use profile_snapshot when available (immutable record of what was submitted).
  // Fall back to live student_profiles join for older records that predate snapshots.
  const student = snap ? {
    id:          rawStudent?.id,
    userId:      rawStudent?.user_id,
    firstName:   snap.firstName,
    lastName:    snap.lastName,
    university:  snap.university,
    faculty:     snap.faculty,
    programme:   snap.programme,
    studyYear:   snap.studyYear,
    skills:      snap.skills,
    bio:         snap.bio,
    languages:   snap.languages,
    avatarUrl:   snap.avatarUrl,
    cvUrl:       snap.cvUrl,
    linkedinUrl: snap.linkedinUrl,
    aiSummary:   snap.aiSummary,
    snapshotAt:  snap.snapshotAt,
  } : rawStudent ? {
    id:          rawStudent.id,
    userId:      rawStudent.user_id,
    firstName:   rawStudent.first_name,
    lastName:    rawStudent.last_name,
    university:  rawStudent.university,
    faculty:     rawStudent.faculty,
    programme:   rawStudent.programme,
    studyYear:   rawStudent.study_year,
    skills:      rawStudent.skills,
    bio:         rawStudent.bio,
    languages:   rawStudent.languages,
    avatarUrl:   rawStudent.avatar_url,
    cvUrl:       rawStudent.cv_url,
    linkedinUrl: rawStudent.linkedin_url,
  } : undefined;

  return {
    id:              a.id,
    status:          a.status,
    coverLetter:     a.cover_letter,
    cvSnapshotUrl:   a.cv_snapshot_url,
    companyNote:     a.company_note,
    internalNote:    showInternal ? (a.internal_note || null) : undefined,
    appliedAt:       a.applied_at,
    reviewedAt:      a.reviewed_at,
    decidedAt:       a.decided_at,
    offerId:         a.offer_id,
    studentId:       a.student_id,
    hasProfileSnapshot: !!snap,
    interview: {
      date:     a.interview_date     || null,
      type:     a.interview_type     || null,
      location: a.interview_location || null,
      link:     a.interview_link     || null,
      notes:    a.interview_notes    || null,
    },
    offer,
    student,
  };
}

// ── PATCH /api/applications/:id/notes ────────────────────────────────────────
// Update internal_note and/or company_note without triggering a status change.
exports.patchNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { internalNote, companyNote } = req.body;

    if (internalNote === undefined && companyNote === undefined)
      return res.status(400).json({ success: false, message: 'Provide internalNote and/or companyNote' });

    const { data: cp } = await supabaseAdmin
      .from('company_profiles').select('id').eq('user_id', req.user.userId).single();

    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('id, internship_offers ( company_id )')
      .eq('id', id)
      .single();

    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (!cp || app.internship_offers.company_id !== cp.id)
      return res.status(403).json({ success: false, message: 'Access denied' });

    const updates = {};
    if (internalNote !== undefined) updates.internal_note = internalNote || null;
    if (companyNote  !== undefined) updates.company_note  = companyNote  || null;

    const { data, error } = await supabaseAdmin
      .from('applications').update(updates).eq('id', id).select().single();

    if (error) throw error;

    res.json({ success: true, data: normaliseApplication(data, { showInternal: true }) });
  } catch (err) { next(err); }
};
