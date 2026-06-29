const { resolveToken } = require('../utils/tokenCache');

module.exports = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  const { user, error } = await resolveToken(token);
  if (error || !user) return res.status(401).json({ success: false, message: 'Invalid or expired token' });

  req.user = user;
  next();
};
