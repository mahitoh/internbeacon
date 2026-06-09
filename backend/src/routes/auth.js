const router       = require('express').Router();
const ctrl         = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validate     = require('../middleware/validate');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  refreshRules,
  resetPasswordRules,
} = require('../utils/validators');

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/register',        registerRules,       validate, ctrl.register);
router.post('/login',           loginRules,          validate, ctrl.login);
router.post('/refresh',         refreshRules,        validate, ctrl.refresh);
router.post('/forgot-password', forgotPasswordRules, validate, ctrl.forgotPassword);
router.post('/reset-password',  resetPasswordRules,  validate, ctrl.resetPassword);

// ── Protected ─────────────────────────────────────────────────────────────────
router.post('/logout',           authenticate, ctrl.logout);
router.get('/me',                authenticate, ctrl.me);
router.post('/complete-profile', authenticate, ctrl.completeProfile);

module.exports = router;
