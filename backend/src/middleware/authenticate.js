const { supabaseAdmin } = require('../config/supabase');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = {
      userId:       user.id,
      email:        user.email,
      role:         user.app_metadata?.role || user.user_metadata?.role,
      userMetadata: user.user_metadata || {},
    };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
