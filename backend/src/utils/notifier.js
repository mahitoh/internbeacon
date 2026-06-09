const { supabaseAdmin }    = require('../config/supabase');
const { emitNotification } = require('../socket');

// Fire-and-forget notification creation — never throws, never blocks the caller
async function notify({ userId, type, title, body, link }) {
  try {
    const { data } = await supabaseAdmin
      .from('notifications')
      .insert({ user_id: userId, type, title, body, link: link || null })
      .select()
      .single();

    // Push real-time notification if the user has an active socket connection
    if (data) {
      emitNotification(userId, {
        id:        data.id,
        userId:    data.user_id,
        type:      data.type,
        title:     data.title,
        body:      data.body,
        link:      data.link,
        isRead:    data.is_read,
        createdAt: data.created_at,
      });
    }
  } catch {
    // Notifications are non-critical
  }
}

module.exports = { notify };
