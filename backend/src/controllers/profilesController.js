const { supabaseAdmin } = require('../config/supabase');

// ── PATCH /api/profiles/student ────────────────────────────────────────────────
exports.updateStudent = async (req, res, next) => {
  try {
    const fieldMap = {
      firstName: 'first_name', lastName: 'last_name', phone: 'phone',
      university: 'university', faculty: 'faculty', programme: 'programme',
      studyYear: 'study_year', bio: 'bio', skills: 'skills',
      languages: 'languages', cvUrl: 'cv_url', avatarUrl: 'avatar_url',
      linkedinUrl: 'linkedin_url', githubUrl: 'github_url',
    };

    const updates = {};
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
    }

    if (updates.study_year !== undefined) {
      const yr = Number(updates.study_year);
      if (!Number.isInteger(yr) || yr < 1 || yr > 5) {
        return res.status(400).json({ success: false, message: 'study_year must be between 1 and 5' });
      }
      updates.study_year = yr;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('student_profiles')
      .update(updates)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: normaliseStudentProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/profiles/company ────────────────────────────────────────────────
exports.updateCompany = async (req, res, next) => {
  try {
    const fieldMap = {
      companyName: 'company_name', sector: 'sector', description: 'description',
      city: 'city', address: 'address', phone: 'phone',
      websiteUrl: 'website_url', logoUrl: 'logo_url', employeeSize: 'employee_size',
    };

    const updates = {};
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .update(updates)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: normaliseCompanyProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/profiles/student/:id ─────────────────────────────────────────────
// :id is the profiles.id (auth user UUID)
exports.getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('student_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, data: normaliseStudentProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/profiles/company/:id ─────────────────────────────────────────────
// :id is the profiles.id (auth user UUID)
exports.getCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.json({ success: true, data: normaliseCompanyProfile(data) });
  } catch (err) {
    next(err);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function computeProfileCompletion(p) {
  let score = 0;
  if (p.first_name && p.last_name)                score += 10;
  if (p.university)                               score += 10;
  if (p.programme)                                score += 10;
  if (p.study_year)                               score += 5;
  if (p.cv_url)                                   score += 25;
  if (p.skills && p.skills.length >= 3)           score += 15;
  if (p.bio)                                      score += 10;
  if (p.avatar_url)                               score += 5;
  if (p.linkedin_url || p.github_url)             score += 5;
  if (p.phone)                                    score += 5;
  return score;
}

function computeCompletionTips(p) {
  const tips = [];
  if (!p.cv_url)
    tips.push({ field: 'cv',      message: 'Upload your CV',              points: 25 });
  if (!p.skills || p.skills.length < 3)
    tips.push({ field: 'skills',  message: 'Add at least 3 skills',       points: 15 });
  if (!p.bio)
    tips.push({ field: 'bio',     message: 'Write a short bio',           points: 10 });
  if (!p.avatar_url)
    tips.push({ field: 'avatar',  message: 'Add a profile photo',         points: 5  });
  if (!p.phone)
    tips.push({ field: 'phone',   message: 'Add your phone number',       points: 5  });
  if (!p.linkedin_url && !p.github_url)
    tips.push({ field: 'links',   message: 'Add LinkedIn or GitHub link', points: 5  });
  return tips.sort((a, b) => b.points - a.points);
}

function normaliseStudentProfile(p) {
  if (!p) return p;
  return {
    id:               p.id,
    userId:           p.user_id,
    firstName:        p.first_name,
    lastName:         p.last_name,
    phone:            p.phone,
    university:       p.university,
    faculty:          p.faculty,
    programme:        p.programme,
    studyYear:        p.study_year,
    bio:              p.bio,
    skills:           p.skills,
    languages:        p.languages,
    cvUrl:            p.cv_url,
    avatarUrl:        p.avatar_url,
    linkedinUrl:      p.linkedin_url,
    githubUrl:        p.github_url,
    completionScore:  computeProfileCompletion(p),
    completionTips:   computeCompletionTips(p),
    createdAt:        p.created_at,
    updatedAt:        p.updated_at,
  };
}

function normaliseCompanyProfile(p) {
  if (!p) return p;
  return {
    id:           p.id,
    userId:       p.user_id,
    companyName:  p.company_name,
    sector:       p.sector,
    description:  p.description,
    city:         p.city,
    address:      p.address,
    phone:        p.phone,
    websiteUrl:   p.website_url,
    logoUrl:      p.logo_url,
    employeeSize: p.employee_size,
    isVerified:   p.is_verified ?? false,
    verifiedAt:   p.verified_at,
    createdAt:    p.created_at,
    updatedAt:    p.updated_at,
  };
}
