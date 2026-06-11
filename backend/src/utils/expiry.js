const { supabaseAdmin } = require('../config/supabase');
const { notify }        = require('./notifier');
const { sendMail, offerExpiredEmail } = require('./mailer');

async function expireOffers() {
  try {
    // Step 1: close expired offers, get just their IDs
    const { data: closed, error: updateErr } = await supabaseAdmin
      .from('internship_offers')
      .update({ status: 'closed' })
      .eq('status', 'open')
      .lt('deadline', new Date().toISOString())
      .select('id');

    if (updateErr) { console.error('[EXPIRY] DB error:', updateErr.message); return; }
    if (!closed?.length) return;

    // Step 2: fetch full details for notifications (separate query avoids join-after-update issue)
    const ids = closed.map(r => r.id);
    const { data: expired, error: fetchErr } = await supabaseAdmin
      .from('internship_offers')
      .select('id, title, company_profiles ( user_id, company_name )')
      .in('id', ids);

    if (fetchErr) { console.error('[EXPIRY] Fetch error:', fetchErr.message); return; }
    if (!expired?.length) return;

    console.log(`[EXPIRY] Auto-closed ${expired.length} expired offer(s)`);

    for (const offer of expired) {
      const companyUserId = offer.company_profiles?.user_id;
      if (!companyUserId) continue;

      notify({
        userId: companyUserId,
        type:   'offer_closed',
        title:  'Offer deadline reached',
        body:   `"${offer.title}" has been automatically closed`,
        link:   '/company/offers',
      });

      try {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(companyUserId);
        const email = authUser?.user?.email;
        if (email) {
          await sendMail({
            to:      email,
            subject: `Your offer "${offer.title}" has closed — InternBeacon`,
            html:    offerExpiredEmail({
              companyName: offer.company_profiles?.company_name || 'there',
              offerTitle:  offer.title,
            }),
          });
        }
      } catch {}
    }
  } catch (err) {
    console.error('[EXPIRY] Unexpected error:', err.message);
  }
}

function startExpiryJob() {
  expireOffers(); // catch already-expired on startup
  setInterval(expireOffers, 60 * 60 * 1000); // re-check every hour
  console.log('[EXPIRY] Offer expiry job started (runs every hour)');
}

module.exports = { startExpiryJob };
