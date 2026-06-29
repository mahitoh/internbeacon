const { supabaseAdmin } = require('../config/supabase');

// In-memory token → user cache. Tokens expire in 1 hour; we cache for 5 min
// so we re-validate well before expiry and don't hold stale revocations long.
const cache = new Map(); // token → { user, expiresAt }
const TTL   = 5 * 60 * 1000; // 5 minutes

async function resolveToken(token) {
  const hit = cache.get(token);
  if (hit && hit.expiresAt > Date.now()) return { user: hit.user, error: null };

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return { user: null, error };

  const userData = {
    userId:       user.id,
    email:        user.email,
    role:         user.app_metadata?.role || user.user_metadata?.role,
    userMetadata: user.user_metadata || {},
  };

  cache.set(token, { user: userData, expiresAt: Date.now() + TTL });

  // Evict expired entries when cache grows large
  if (cache.size > 500) {
    const now = Date.now();
    for (const [k, v] of cache) if (v.expiresAt < now) cache.delete(k);
  }

  return { user: userData, error: null };
}

module.exports = { resolveToken };
