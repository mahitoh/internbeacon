const multer = require('multer');
const { supabaseAdmin } = require('../config/supabase');

// ── Helpers ───────────────────────────────────────────────────────────────────
// file-type is ESM-only (v20+), so we use dynamic import
async function detectMime(buffer) {
  const { fileTypeFromBuffer } = await import('file-type');
  return fileTypeFromBuffer(buffer);
}

const ALLOWED_PDF   = new Set(['application/pdf']);
const ALLOWED_IMAGE = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// ── Multer instances ──────────────────────────────────────────────────────────
const mem = multer.memoryStorage();

exports.cvMiddleware = multer({
  storage: mem,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(Object.assign(new Error('Only PDF files are allowed'), { status: 400 }));
  },
}).single('file');

exports.imageMiddleware = multer({
  storage: mem,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(Object.assign(new Error('Only image files are allowed'), { status: 400 }));
  },
}).single('file');

// ── POST /api/upload/cv ───────────────────────────────────────────────────────
exports.uploadCv = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const detected = await detectMime(req.file.buffer);
    if (!detected || !ALLOWED_PDF.has(detected.mime)) {
      return res.status(400).json({ success: false, message: 'Only PDF files are allowed' });
    }

    const storagePath = `${req.user.userId}.pdf`;
    const { error } = await supabaseAdmin.storage
      .from('cvs')
      .upload(storagePath, req.file.buffer, { contentType: 'application/pdf', upsert: true });

    if (error) throw error;

    await supabaseAdmin
      .from('student_profiles')
      .update({ cv_url: storagePath })
      .eq('user_id', req.user.userId);

    res.json({ success: true, data: { path: storagePath } });
  } catch (err) { next(err); }
};

// ── POST /api/upload/cv-snapshot ─────────────────────────────────────────────
// Stores a PDF at applications/{userId}/{timestamp}.pdf WITHOUT touching the
// student's profile CV. Used when a student attaches an application-specific CV.
exports.uploadCvSnapshot = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const detected = await detectMime(req.file.buffer);
    if (!detected || !ALLOWED_PDF.has(detected.mime)) {
      return res.status(400).json({ success: false, message: 'Only PDF files are allowed' });
    }

    const storagePath = `applications/${req.user.userId}/${Date.now()}.pdf`;
    const { error } = await supabaseAdmin.storage
      .from('cvs')
      .upload(storagePath, req.file.buffer, { contentType: 'application/pdf', upsert: false });

    if (error) throw error;

    res.json({ success: true, data: { path: storagePath } });
  } catch (err) { next(err); }
};

// ── POST /api/upload/avatar ───────────────────────────────────────────────────
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const detected = await detectMime(req.file.buffer);
    if (!detected || !ALLOWED_IMAGE.has(detected.mime)) {
      return res.status(400).json({ success: false, message: 'Only JPEG, PNG, WebP, or GIF images are allowed' });
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase() || 'jpg';
    const storagePath = `${req.user.userId}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(storagePath);

    await supabaseAdmin
      .from('student_profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', req.user.userId);

    res.json({ success: true, data: { url: publicUrl } });
  } catch (err) { next(err); }
};

// ── POST /api/upload/logo ─────────────────────────────────────────────────────
exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const detected = await detectMime(req.file.buffer);
    if (!detected || !ALLOWED_IMAGE.has(detected.mime)) {
      return res.status(400).json({ success: false, message: 'Only JPEG, PNG, WebP, or GIF images are allowed' });
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase() || 'png';
    const storagePath = `${req.user.userId}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from('logos')
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage.from('logos').getPublicUrl(storagePath);

    await supabaseAdmin
      .from('company_profiles')
      .update({ logo_url: publicUrl })
      .eq('user_id', req.user.userId);

    res.json({ success: true, data: { url: publicUrl } });
  } catch (err) { next(err); }
};

// ── GET /api/upload/cv-url/:studentUserId ─────────────────────────────────────
// Returns a 1-hour signed URL for a student's CV.
// Allowed: the student themselves, any company with a shared application, admins.
//
// SECURITY: we never trust the client-supplied ?path. Instead we build the set of
// CV paths the requester is genuinely entitled to — the student's profile CV plus
// the cv_snapshot_url of every application the requester may see — straight from
// the DB, and require ?path to be one of them. This closes the IDOR while still
// supporting per-application snapshots whose storage folder is namespaced by the
// applicant's user id (which may differ from the student's *current* user id).
exports.getCvSignedUrl = async (req, res, next) => {
  try {
    const { studentUserId } = req.params;
    const { userId, role } = req.user;
    const requestedPath = req.query.path;

    if (requestedPath && requestedPath.includes('..')) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { data: sp } = await supabaseAdmin
      .from('student_profiles').select('id, cv_url').eq('user_id', studentUserId).single();
    if (!sp) return res.status(404).json({ success: false, message: 'Student not found' });

    // Which of this student's applications may the requester see?
    let appsQuery = supabaseAdmin
      .from('applications').select('cv_snapshot_url').eq('student_id', sp.id);

    if (role === 'student') {
      if (userId !== studentUserId) return res.status(403).json({ success: false, message: 'Forbidden' });
    } else if (role === 'company') {
      const { data: cp } = await supabaseAdmin
        .from('company_profiles').select('id').eq('user_id', userId).single();
      if (!cp) return res.status(400).json({ success: false, message: 'Company profile not found' });

      const { data: offers } = await supabaseAdmin
        .from('internship_offers').select('id').eq('company_id', cp.id);
      const offerIds = (offers || []).map(o => o.id);
      if (!offerIds.length) return res.status(403).json({ success: false, message: 'No shared application' });

      appsQuery = appsQuery.in('offer_id', offerIds);
    } else if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { data: apps } = await appsQuery;
    if (role === 'company' && !apps?.length) {
      return res.status(403).json({ success: false, message: 'No shared application found' });
    }

    // Allowed CV paths, derived entirely from the DB.
    const allowed = new Set([`${studentUserId}.pdf`]);
    if (sp.cv_url) allowed.add(sp.cv_url);
    for (const a of (apps || [])) if (a.cv_snapshot_url) allowed.add(a.cv_snapshot_url);

    let cvPath;
    if (requestedPath) {
      if (!allowed.has(requestedPath)) return res.status(403).json({ success: false, message: 'Forbidden' });
      cvPath = requestedPath;
    } else {
      cvPath = sp.cv_url || `${studentUserId}.pdf`;
    }

    const { data, error } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUrl(cvPath, 3600);

    if (error) return res.status(404).json({ success: false, message: 'CV not found' });

    res.json({ success: true, data: { url: data.signedUrl } });
  } catch (err) { next(err); }
};
