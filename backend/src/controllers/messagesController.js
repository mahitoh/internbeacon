const { supabaseAdmin }                              = require('../config/supabase');
const { notify }                                     = require('../utils/notifier');
const { emitNewMessage, emitReadReceipt }            = require('../socket');
const { sendMail, messageEmail }                     = require('../utils/mailer');

// ── Shared helper: resolve thread parties for an application ──────────────────
// Returns { studentUserId, companyUserId, offerId } or throws
async function resolveThread(appId) {
  const { data: app, error } = await supabaseAdmin
    .from('applications')
    .select(`
      id, student_id, offer_id,
      student_profiles ( user_id, first_name, last_name ),
      internship_offers ( company_id, title, company_profiles ( user_id, company_name ) )
    `)
    .eq('id', appId)
    .single();

  if (error || !app) return null;

  const sp = app.student_profiles;
  const cp = app.internship_offers.company_profiles;

  return {
    app,
    studentUserId: sp.user_id,
    companyUserId: cp.user_id,
    offerTitle:    app.internship_offers.title,
    studentName:   [sp.first_name, sp.last_name].filter(Boolean).join(' ') || 'Student',
    companyName:   cp.company_name || 'Company',
  };
}

// ── GET /api/messages/threads ──────────────────────────────────────────────────
// Returns all applications that have at least one message involving this user.
// Uses 3 flat queries instead of 2n+1 to avoid N+1 performance issues.
exports.listThreads = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // 1. Distinct app_ids where this user is sender or receiver
    const appIds = await getAppIdsForUser(userId);
    if (!appIds.length) return res.json({ success: true, data: [] });

    // 2. Thread metadata for all app_ids in one query
    const { data: threads, error: threadErr } = await supabaseAdmin
      .from('applications')
      .select(`
        id,
        internship_offers ( id, title, company_profiles ( company_name, logo_url ) ),
        student_profiles ( first_name, last_name, avatar_url )
      `)
      .in('id', appIds);

    if (threadErr) throw threadErr;

    // 3. All messages for those app_ids in one query — compute last/unread in JS
    const { data: allMessages, error: msgErr } = await supabaseAdmin
      .from('messages')
      .select('app_id, content, sent_at, sender_id, receiver_id, is_read')
      .in('app_id', appIds)
      .order('sent_at', { ascending: false });

    if (msgErr) throw msgErr;

    // Group messages by app_id
    const byApp = {};
    for (const m of (allMessages || [])) {
      if (!byApp[m.app_id]) byApp[m.app_id] = [];
      byApp[m.app_id].push(m);
    }

    const enriched = threads.map((t) => {
      const msgs   = byApp[t.id] || [];
      const lastMsg = msgs[0] || null; // already sorted desc
      const unread  = msgs.filter(m => m.receiver_id === userId && !m.is_read).length;

      return {
        appId:       t.id,
        offer:       t.internship_offers,
        student:     t.student_profiles,
        lastMessage: lastMsg,
        unreadCount: unread,
      };
    });

    // Sort threads by last message date descending
    enriched.sort((a, b) => {
      const aTime = a.lastMessage?.sent_at || 0;
      const bTime = b.lastMessage?.sent_at || 0;
      return aTime < bTime ? 1 : -1;
    });

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/messages/app/:appId ───────────────────────────────────────────────
// All messages in one thread — must be the student or company on the application
exports.listThread = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const userId    = req.user.userId;

    const thread = await resolveThread(appId);
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });

    if (userId !== thread.studentUserId && userId !== thread.companyUserId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('app_id', appId)
      .order('sent_at', { ascending: true });

    if (error) throw error;

    // Auto-mark messages sent to this user as read
    const unreadIds = (data || [])
      .filter(m => m.receiver_id === userId && !m.is_read)
      .map(m => m.id);

    if (unreadIds.length > 0) {
      await supabaseAdmin
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds);

      // Broadcast read receipts to the thread room
      emitReadReceipt(appId, unreadIds, userId);
    }

    res.json({ success: true, data: data.map(normaliseMessage) });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/messages/app/:appId ──────────────────────────────────────────────
exports.send = async (req, res, next) => {
  try {
    const { appId }  = req.params;
    const { content } = req.body;
    const userId     = req.user.userId;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const thread = await resolveThread(appId);
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });

    if (userId !== thread.studentUserId && userId !== thread.companyUserId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const senderIsStudent = userId === thread.studentUserId;
    const receiverId   = senderIsStudent ? thread.companyUserId : thread.studentUserId;
    // Notification link must be role-prefixed to match the frontend routes
    // (/student/messages/:appId or /company/messages/:appId); a bare
    // /messages/:appId has no route and falls through to the home wildcard.
    const receiverBase = senderIsStudent ? '/company' : '/student';

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        app_id:      appId,
        sender_id:   userId,
        receiver_id: receiverId,
        content:     content.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    const msg = normaliseMessage(data);

    // Push message in real time to everyone in the thread room
    emitNewMessage(appId, msg);

    // Notify recipient (also pushes real-time notification via socket)
    notify({
      userId: receiverId,
      type:   'new_message',
      title:  'New message',
      body:   `You have a new message about "${thread.offerTitle}"`,
      link:   `${receiverBase}/messages/${appId}`,
    });

    // Email the recipient only for the FIRST unread message in this thread
    // so active conversations don't spam the inbox.
    const { count: unreadInThread } = await supabaseAdmin
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('app_id', appId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);

    if (unreadInThread === 1) {
      const senderName = senderIsStudent ? thread.studentName : thread.companyName;
      supabaseAdmin.auth.admin.getUserById(receiverId).then(({ data: au }) => {
        const email = au?.user?.email;
        if (email) sendMail({
          to:      email,
          subject: `New message about "${thread.offerTitle}" — InternBeacon`,
          html:    messageEmail({
            senderName,
            offerTitle:     thread.offerTitle,
            messagePreview: content.trim(),
            link:           `${process.env.CLIENT_URL || 'http://localhost:5173'}${receiverBase}/messages/${appId}`,
          }),
        });
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/messages/:id/read ───────────────────────────────────────────────
exports.markRead = async (req, res, next) => {
  try {
    const { id }  = req.params;
    const userId  = req.user.userId;

    const { data: msg } = await supabaseAdmin
      .from('messages')
      .select('receiver_id, is_read')
      .eq('id', id)
      .single();

    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    if (msg.receiver_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (msg.is_read) return res.json({ success: true, message: 'Already read' });

    const { data: updated } = await supabaseAdmin
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .select('app_id')
      .single();

    if (updated) emitReadReceipt(updated.app_id, [id], userId);

    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/messages/unread-count ────────────────────────────────────────────
exports.unreadCount = async (req, res, next) => {
  try {
    const { count, error } = await supabaseAdmin
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', req.user.userId)
      .eq('is_read', false);

    if (error) throw error;

    res.json({ success: true, data: { unreadCount: count } });
  } catch (err) {
    next(err);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getAppIdsForUser(userId) {
  const { data } = await supabaseAdmin
    .from('messages')
    .select('app_id')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  if (!data) return [];
  return [...new Set(data.map(m => m.app_id))];
}

function normaliseMessage(m) {
  return {
    id:         m.id,
    appId:      m.app_id,
    senderId:   m.sender_id,
    receiverId: m.receiver_id,
    content:    m.content,
    isRead:     m.is_read,
    sentAt:     m.sent_at,
    readAt:     m.read_at,
  };
}
