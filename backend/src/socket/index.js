const { Server }       = require('socket.io');
const { supabaseAdmin } = require('../config/supabase');

let io = null;

// ── Initialize Socket.IO ───────────────────────────────────────────────────────
function initSocket(httpServer) {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_WWW,
    'http://localhost:5173',
  ].filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin:      allowedOrigins,
      credentials: true,
    },
  });

  // ── Auth middleware ─────────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return next(new Error('Invalid or expired token'));

    socket.userId   = user.id;
    socket.userRole = user.app_metadata?.role || user.user_metadata?.role;
    next();
  });

  const isDev = process.env.NODE_ENV !== 'production';

  // ── Connection handler ──────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const { userId, userRole } = socket;
    if (isDev) console.log(`[WS] connected  uid=${userId} role=${userRole}`);

    // Simple rate limiter: max 30 events per 10 seconds per connection
    let eventCount = 0;
    const rlReset  = setInterval(() => { eventCount = 0; }, 10_000);
    socket.use((_, next) => {
      eventCount++;
      if (eventCount > 30) return next(new Error('Rate limit exceeded'));
      next();
    });
    socket.on('disconnect', () => clearInterval(rlReset));

    // Every user automatically joins their private room
    socket.join(`user:${userId}`);

    // ── join_thread ───────────────────────────────────────────────────────────
    // Client: socket.emit('join_thread', appId)
    socket.on('join_thread', async (appId) => {
      try {
        const allowed = await canAccessThread(appId, userId);
        if (!allowed) {
          socket.emit('error', { message: 'Access denied to this thread' });
          return;
        }
        socket.join(`thread:${appId}`);
        if (isDev) console.log(`[WS] uid=${userId} joined thread:${appId}`);
      } catch {
        socket.emit('error', { message: 'Failed to join thread' });
      }
    });

    // ── leave_thread ──────────────────────────────────────────────────────────
    socket.on('leave_thread', (appId) => {
      socket.leave(`thread:${appId}`);
      if (isDev) console.log(`[WS] uid=${userId} left thread:${appId}`);
    });

    socket.on('disconnect', () => {
      if (isDev) console.log(`[WS] disconnected uid=${userId}`);
    });
  });

  return io;
}

// ── Getters used by controllers / notifier ────────────────────────────────────
function getIO() {
  return io;
}

// Emit a new message to everyone in the thread room
function emitNewMessage(appId, message) {
  if (!io) return;
  io.to(`thread:${appId}`).emit('new_message', message);
}

// Emit a notification to a specific user's private room
function emitNotification(userId, notification) {
  if (!io) return;
  io.to(`user:${userId}`).emit('new_notification', notification);
}

// Emit a real-time read receipt to the thread
function emitReadReceipt(appId, messageIds, readerId) {
  if (!io) return;
  io.to(`thread:${appId}`).emit('messages_read', { messageIds, readerId });
}

// ── Helper: check if a user can access a thread ───────────────────────────────
async function canAccessThread(appId, userId) {
  const { data: app } = await supabaseAdmin
    .from('applications')
    .select(`
      student_profiles ( user_id ),
      internship_offers ( company_profiles ( user_id ) )
    `)
    .eq('id', appId)
    .single();

  if (!app) return false;

  const studentUserId = app.student_profiles?.user_id;
  const companyUserId = app.internship_offers?.company_profiles?.user_id;

  return userId === studentUserId || userId === companyUserId;
}

module.exports = { initSocket, getIO, emitNewMessage, emitNotification, emitReadReceipt };
