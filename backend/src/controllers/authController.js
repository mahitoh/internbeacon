const { supabaseAdmin, supabaseAuth } = require('../config/supabase');
const { normaliseStudentProfile, normaliseCompanyProfile } = require('./profilesController');

// supabase-js has no admin.getUserByEmail(), so page through listUsers() to find
// a user by email. Capped at 20 pages so a large user base can't loop unbounded
// — fine at this app's scale, and used only on auth error paths (not hot paths).
async function findUserByEmail(email) {
  const target = String(email || '').toLowerCase();
  if (!target) return null;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) return null;
    const match = data.users.find(u => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 200) return null; // reached the last page
  }
  return null;
}

// ── POST /api/auth/register ────────────────────────────────────────────────────
// Creates the Supabase auth user (which fires the handle_new_user trigger and
// auto-creates the public.profiles row), then creates the role-specific profile.
exports.register = async (req, res, next) => {
  const { email, password, role, ...profileData } = req.body;
  let userId = null;

  try {
    // 1. Create user in Supabase Auth.
    //    The handle_new_user trigger fires immediately and creates public.profiles.
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role },
      app_metadata:  { role },
      // Auto-confirm in dev so testers can log in immediately.
      // In production, Supabase sends a verification email and users must click it.
      email_confirm: process.env.NODE_ENV !== 'production',
    });

    if (authError) {
      const msg = authError.message?.toLowerCase() || '';
      const isDuplicate =
        msg.includes('already registered') ||
        msg.includes('already been registered') ||
        msg.includes('already exists') ||
        authError.status === 422;

      if (isDuplicate) {
        // Check if the existing account is Google-only (no password set).
        try {
          const existingUser = await findUserByEmail(email);
          if (existingUser) {
            const identities = existingUser.identities || [];
            const isGoogleOnly = identities.length > 0 && identities.every(i => i.provider === 'google');
            if (isGoogleOnly) {
              return res.status(409).json({
                success: false,
                message: 'This email is linked to a Google account. Use "Continue with Google" to sign in.',
                code:    'GOOGLE_ACCOUNT_EXISTS',
              });
            }
          }
        } catch {}

        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists. Please sign in instead.',
          code:    'EMAIL_EXISTS',
        });
      }

      throw authError;
    }

    userId = authData.user.id;

    // 2. Create the role-specific profile.
    //    public.profiles already exists at this point (created by trigger).
    if (role === 'student') {
      const { error } = await supabaseAdmin
        .from('student_profiles')
        .insert({
          user_id:    userId,
          first_name: profileData.firstName,
          last_name:  profileData.lastName,
          university: profileData.university,
          programme:  profileData.programme,
          study_year: Number(profileData.studyYear),
        });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('company_profiles')
        .insert({
          user_id:      userId,
          company_name: profileData.companyName,
          sector:       profileData.sector,
          city:         profileData.city,
        });
      if (error) throw error;
    }

    res.status(201).json({
      success: true,
      message: process.env.NODE_ENV === 'production'
        ? 'Account created. Please check your email to verify your account.'
        : 'Account created successfully.',
    });
  } catch (err) {
    // Clean up: if profile creation failed after the auth user was created,
    // delete the Supabase user to keep auth and public schema in sync.
    if (userId) {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
    }
    next(err);
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

    if (error) {
      const msg = error.message?.toLowerCase() || '';

      if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email address. Check your inbox for the verification link.',
          code:    'EMAIL_NOT_VERIFIED',
        });
      }

      // Suspended/banned account. GoTrue rejects the login with code 'user_banned'
      // ("User is banned") as soon as the account is banned — before checking the
      // password — so this reliably catches a suspended user. (banned_until isn't
      // exposed by the admin API, so the login error code is the signal we use.)
      if (error.code === 'user_banned' || msg.includes('banned') || msg.includes('suspended')) {
        return res.status(403).json({
          success: false,
          message: 'This account has been suspended. Please contact support if you believe this is a mistake.',
          code:    'ACCOUNT_SUSPENDED',
        });
      }

      // Otherwise the credentials were invalid. Distinguish a Google-only
      // (password-less) account so we can point the user at the right button
      // instead of a blanket "incorrect password".
      try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          const identities = existingUser.identities || [];
          const isGoogleOnly = identities.length > 0 && identities.every(i => i.provider === 'google');
          if (isGoogleOnly) {
            return res.status(401).json({
              success: false,
              message: 'This account was created with Google. Please use the "Continue with Google" button to sign in.',
              code:    'GOOGLE_ACCOUNT',
            });
          }
        }
      } catch {}

      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const { session, user } = data;

    // Enforce email verification even if Supabase let the user through
    if (!user.email_confirmed_at) {
      await supabaseAdmin.auth.admin.signOut(session.access_token).catch(() => {});
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address. Check your inbox for the verification link.',
        code:    'EMAIL_NOT_VERIFIED',
      });
    }

    const role = user.app_metadata?.role || user.user_metadata?.role;

    // Check account is active in our system
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single();

    if (!profile?.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support if you believe this is a mistake.',
        code:    'ACCOUNT_DEACTIVATED',
      });
    }

    res.json({
      success:      true,
      accessToken:  session.access_token,
      refreshToken: session.refresh_token,
      role,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/refresh ─────────────────────────────────────────────────────
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const { data, error } = await supabaseAuth.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data?.session) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    res.json({
      success:      true,
      accessToken:  data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout  (requires authenticate) ────────────────────────────
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await supabaseAdmin.auth.admin.signOut(token);
    }
  } catch {
    // Swallow — client clears tokens regardless
  }
  res.json({ success: true, message: 'Logged out' });
};

// ── GET /api/auth/me  (requires authenticate) ─────────────────────────────────
exports.me = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*, student_profiles(*), company_profiles(*)')
      .eq('id', req.user.userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const { student_profiles, company_profiles, is_active, created_at, updated_at, ...rest } = profile;
    const meta = req.user.userMetadata || {};
    res.json({
      success: true,
      data: {
        ...rest,
        // Use the role the backend authorizes with (app_metadata) as the single
        // source of truth. profiles.role can drift (e.g. the handle_new_user
        // trigger defaults companies to 'student' when user_metadata.role is
        // unset), which would make ProtectedRoute disagree with the backend and
        // bounce a logged-in user to the landing page after login.
        role:           req.user.role || rest.role,
        email:          req.user.email,
        isActive:       is_active,
        createdAt:      created_at,
        updatedAt:      updated_at,
        avatarUrl:      meta.avatar_url || meta.picture || null,
        studentProfile: normaliseStudentProfile(student_profiles),
        companyProfile: normaliseCompanyProfile(company_profiles),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/complete-profile  (Google OAuth new-user onboarding) ───────
exports.completeProfile = async (req, res, next) => {
  try {
    const { role, ...profileData } = req.body;
    const userId = req.user.userId;

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ success: false, message: 'role must be "student" or "company"' });
    }

    // Idempotent — if profile already exists just return success
    const table = role === 'student' ? 'student_profiles' : 'company_profiles';
    const { data: existing } = await supabaseAdmin
      .from(table)
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return res.json({ success: true, role, alreadyExists: true });
    }

    // Ensure the profiles row has the correct role
    // (Google OAuth users land here with role = null from the trigger)
    await supabaseAdmin
      .from('profiles')
      .upsert({ id: userId, role }, { onConflict: 'id' });

    // Update Supabase JWT metadata so the role appears in future tokens
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata:  { role },
      user_metadata: { role },
    });

    // Pull Google avatar URL from user metadata if available
    const { data: { user: freshUser } } = await supabaseAdmin.auth.admin.getUserById(userId);
    const googleMeta = freshUser?.user_metadata || {};
    const googleAvatarUrl = googleMeta.avatar_url || googleMeta.picture || null;

    if (role === 'student') {
      const { error } = await supabaseAdmin
        .from('student_profiles')
        .insert({
          user_id:    userId,
          first_name: profileData.firstName || '',
          last_name:  profileData.lastName  || '',
          university: profileData.university || '',
          programme:  profileData.programme  || '',
          study_year: Number(profileData.studyYear) || 1,
          ...(googleAvatarUrl ? { avatar_url: googleAvatarUrl } : {}),
        });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('company_profiles')
        .insert({
          user_id:      userId,
          company_name: profileData.companyName || '',
          sector:       profileData.sector || null,
          city:         profileData.city   || null,
          ...(googleAvatarUrl ? { logo_url: googleAvatarUrl } : {}),
        });
      if (error) throw error;
    }

    res.json({ success: true, role });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await supabaseAuth.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    });
    // Always success — never reveal whether an email exists
    res.json({
      success: true,
      message: 'If that email is registered, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/reset-password ─────────────────────────────────────────────
// Called by the frontend after the user clicks the email link and lands on
// /reset-password with the Supabase access_token in the URL hash.
// Flow: user clicks link → frontend extracts access_token → POST here with { access_token, password }
exports.resetPassword = async (req, res, next) => {
  try {
    const { access_token, password } = req.body;

    // Validate the recovery token and get the user identity
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.getUser(access_token);

    if (getUserError || !user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Update the password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) throw updateError;

    // Invalidate the recovery session so the token can't be reused
    await supabaseAdmin.auth.admin.signOut(access_token).catch(() => {});

    res.json({ success: true, message: 'Password updated successfully. Please log in again.' });
  } catch (err) {
    next(err);
  }
};
