const { supabaseAdmin }      = require('../config/supabase');
const { computeMatch } = require('./matchingEngine');
const { notify }               = require('./notifier');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Fire-and-forget: score a newly-published offer against every student who
 * has offer alerts enabled and notify those who meet their threshold.
 *
 * Expects raw DB row (snake_case) — computeMatch handles both camelCase and snake_case.
 */
async function fireOfferAlerts(offer) {
  try {
    // Absent row = defaults apply (alerts on, threshold 50) — only an explicit
    // opt-out row excludes a student.
    const { data: prefs } = await supabaseAdmin
      .from('notification_preferences')
      .select('user_id, offer_alerts, min_match_score');

    const optedOut = new Set((prefs || []).filter(p => !p.offer_alerts).map(p => p.user_id));
    const prefMap  = Object.fromEntries((prefs || []).map(p => [p.user_id, p.min_match_score ?? 50]));

    const { data: students } = await supabaseAdmin
      .from('student_profiles')
      .select('user_id, skills, programme, faculty, study_year, languages, ai_summary');

    if (!students?.length) return;

    for (const student of students) {
      if (optedOut.has(student.user_id)) continue;
      const threshold = prefMap[student.user_id] ?? 50;
      const result    = computeMatch(student, offer);
      if (result.score < threshold) continue;

      notify({
        userId: student.user_id,
        type:   'offer',
        title:  'New internship matches your profile',
        body:   `${offer.title} — ${result.score}% match (${result.verdict})`,
        link:   `/student/offers/${offer.id}`,
      });
    }
  } catch (err) {
    if (isDev) console.error('[offerAlerts]', err.message);
  }
}

module.exports = { fireOfferAlerts };
