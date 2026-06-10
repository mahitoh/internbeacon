const { supabaseAdmin, supabaseAuth } = require('../config/supabase');

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
          const { data: { user: existingUser } } = await supabaseAdmin.auth.admin.getUserByEmail(email);
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

      // Check whether this account exists but was created via Google OAuth (no password set).
      // Supabase returns generic `invalid_credentials` for both wrong password and
      // password-less OAuth accounts, so we need to look it up explicitly.
      try {
        const { data: { user: existingUser } } = await supabaseAdmin.auth.admin.getUserByEmail(email);
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
      return res.status(403).json({ success: false, message: 'Account deactivated' });
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
        email:          req.user.email,
        isActive:       is_active,
        createdAt:      created_at,
        updatedAt:      updated_at,
        avatarUrl:      meta.avatar_url || meta.picture || null,
        studentProfile: student_profiles,
        companyProfile: company_profiles,
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
