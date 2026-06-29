const { resolveToken } = require('../utils/tokenCache');

// Like authenticate but never blocks — sets req.user if a valid token is present,
// otherwise just calls next() so the route still works for unauthenticated requests.
module.exports = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return next();

  try {
    const { user } = await resolveToken(token);
    if (user) req.user = user;
  } catch {}

  next();
};
