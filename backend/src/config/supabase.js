const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;

// Admin client — service role key, bypasses RLS.
// Used for: auth.admin.createUser, auth.admin.signOut, all DB writes during registration.
const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Auth client — anon key, for user-facing auth operations.
// Used for: signInWithPassword, refreshSession, resetPasswordForEmail.
const supabaseAuth = createClient(url, process.env.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabaseAdmin, supabaseAuth };
