const { supabaseAdmin } = require('../config/supabase');

// ── GET /api/analytics/student ────────────────────────────────────────────────
exports.studentAnalytics = async (req, res, next) => {
  try {
    const { data: sp } = await supabaseAdmin
      .from('student_profiles').select('id').eq('user_id', req.user.userId).single();
    if (!sp) return res.status(400).json({ success: false, message: 'Profile not found' });

    const { data: apps } = await supabaseAdmin
      .from('applications')
      .select('status, applied_at, reviewed_at, decided_at')
      .eq('student_id', sp.id);

    const all = apps || [];

    const counts = {
      total:       all.length,
      active:      all.filter(a => ['submitted', 'under_review', 'final_review'].includes(a.status)).length,
      shortlisted: all.filter(a => ['shortlisted', 'interview_scheduled', 'interview_completed', 'final_review', 'accepted', 'offer_accepted'].includes(a.status)).length,
      interviewed: all.filter(a => ['interview_scheduled', 'interview_completed', 'final_review', 'accepted', 'offer_accepted'].includes(a.status)).length,
      accepted:    all.filter(a => ['accepted', 'offer_accepted'].includes(a.status)).length,
      offerAccepted: all.filter(a => a.status === 'offer_accepted').length,
      rejected:    all.filter(a => ['rejected', 'withdrawn', 'offer_declined'].includes(a.status)).length,
    };

    const reviewedApps = all.filter(a => a.reviewed_at && a.applied_at);
    const avgReviewHours = reviewedApps.length > 0
      ? Math.round(
          reviewedApps.reduce((sum, a) =>
            sum + (new Date(a.reviewed_at) - new Date(a.applied_at)) / (1000 * 60 * 60), 0
          ) / reviewedApps.length
        )
      : null;

    res.json({
      success: true,
      data: {
        totalApplications: counts.total,
        shortlistRate:     counts.total > 0 ? Math.round((counts.shortlisted  / counts.total) * 100) : 0,
        interviewRate:     counts.total > 0 ? Math.round((counts.interviewed  / counts.total) * 100) : 0,
        acceptanceRate:    counts.total > 0 ? Math.round((counts.accepted     / counts.total) * 100) : 0,
        avgReviewTimeHours: avgReviewHours,
        statusBreakdown: {
          active:       counts.active,
          shortlisted:  all.filter(a => a.status === 'shortlisted').length,
          interview:    all.filter(a => ['interview_scheduled', 'interview_completed'].includes(a.status)).length,
          accepted:     counts.accepted,
          offerAccepted: counts.offerAccepted,
          rejected:     counts.rejected,
        },
      },
    });
  } catch (err) { next(err); }
};

// ── GET /api/analytics/company ────────────────────────────────────────────────
exports.companyAnalytics = async (req, res, next) => {
  try {
    const { data: cp } = await supabaseAdmin
      .from('company_profiles').select('id').eq('user_id', req.user.userId).single();
    if (!cp) return res.status(400).json({ success: false, message: 'Profile not found' });

    const { data: offerRows } = await supabaseAdmin
      .from('internship_offers')
      .select('id, title, openings, filled_count')
      .eq('company_id', cp.id);

    const offerIds = (offerRows || []).map(o => o.id);

    if (!offerIds.length) {
      return res.json({ success: true, data: { totalApplications: 0, offerCount: 0 } });
    }

    const { data: apps } = await supabaseAdmin
      .from('applications')
      .select('id, status, applied_at, reviewed_at, decided_at, offer_id, student_profiles ( skills )')
      .in('offer_id', offerIds);

    const all = apps || [];

    const acceptedCount      = all.filter(a => ['accepted', 'offer_accepted'].includes(a.status)).length;
    const offerAcceptedCount = all.filter(a => a.status === 'offer_accepted').length;
    const interviewCount     = all.filter(a =>
      ['interview_scheduled', 'interview_completed', 'final_review', 'accepted', 'offer_accepted'].includes(a.status)
    ).length;

    const reviewedApps = all.filter(a => a.reviewed_at && a.applied_at);
    const avgReviewHours = reviewedApps.length > 0
      ? Math.round(
          reviewedApps.reduce((sum, a) =>
            sum + (new Date(a.reviewed_at) - new Date(a.applied_at)) / (1000 * 60 * 60), 0
          ) / reviewedApps.length
        )
      : null;

    // Top skills across applicant pool
    const skillCounts = {};
    all.forEach(a => {
      (a.student_profiles?.skills || []).forEach(s => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    // Per-offer breakdown
    const applicationsByOffer = (offerRows || []).map(offer => ({
      offerId:    offer.id,
      title:      offer.title,
      openings:   offer.openings,
      filledCount: offer.filled_count,
      total:      all.filter(a => a.offer_id === offer.id).length,
      accepted:   all.filter(a => a.offer_id === offer.id && ['accepted', 'offer_accepted'].includes(a.status)).length,
    }));

    res.json({
      success: true,
      data: {
        totalApplications:       all.length,
        offerCount:              offerIds.length,
        interviewConversionRate: all.length > 0 ? Math.round((interviewCount     / all.length)      * 100) : 0,
        offerAcceptanceRate:     acceptedCount  > 0 ? Math.round((offerAcceptedCount / acceptedCount) * 100) : 0,
        avgReviewTimeHours,
        topSkillsInPool:         topSkills,
        applicationsByOffer,
      },
    });
  } catch (err) { next(err); }
};
