const { supabaseAdmin } = require('../config/supabase');

// Like authenticate but never blocks — sets req.user if a valid token is present,
// otherwise just calls next() so the route still works for unauthenticated requests.
module.exports = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return next();

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      req.user = {
        userId:       user.id,
        email:        user.email,
        role:         user.app_metadata?.role || user.user_metadata?.role,
        userMetadata: user.user_metadata || {},
      };
    }
  } catch {}

  next();
};
