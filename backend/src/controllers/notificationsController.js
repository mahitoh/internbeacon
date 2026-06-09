const { supabaseAdmin } = require('../config/supabase');

// ── GET /api/notifications ─────────────────────────────────────────────────────
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (unreadOnly === 'true') query = query.eq('is_read', false);

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data: data.map(normaliseNotification),
      meta: { total: count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/notifications/unread-count ───────────────────────────────────────
exports.unreadCount = async (req, res, next) => {
  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.user.userId)
      .eq('is_read', false);

    if (error) throw error;

    res.json({ success: true, data: { unreadCount: count } });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/:id/read ─────────────────────────────────────────
exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: notif } = await supabaseAdmin
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    if (notif.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: normaliseNotification(data) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/read-all ─────────────────────────────────────────
exports.markAllRead = async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.userId)
      .eq('is_read', false);

    if (error) throw error;

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/notifications/:id ─────────────────────────────────────────────
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: notif } = await supabaseAdmin
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    if (notif.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { error } = await supabaseAdmin.from('notifications').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function normaliseNotification(n) {
  return {
    id:        n.id,
    userId:    n.user_id,
    type:      n.type,
    title:     n.title,
    body:      n.body,
    link:      n.link,
    isRead:    n.is_read,
    createdAt: n.created_at,
  };
}
