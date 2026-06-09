const router       = require('express').Router();
const ctrl         = require('../controllers/applicationsController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
const { applyRules, updateStatusRules } = require('../utils/validators');

// ── Student ───────────────────────────────────────────────────────────────────
router.post('/',              authenticate, authorize('student'), applyRules, validate, ctrl.apply);
router.get('/my',             authenticate, authorize('student'), ctrl.myApplications);
router.patch('/:id/withdraw', authenticate, authorize('student'), ctrl.withdraw);
router.patch('/:id/respond',  authenticate, authorize('student'), ctrl.respondToOffer);

// ── Company ───────────────────────────────────────────────────────────────────
router.get('/company',        authenticate, authorize('company'), ctrl.companyApplications);
router.get('/offer/:offerId', authenticate, authorize('company'), ctrl.offerApplications);
router.patch('/:id/status',   authenticate, authorize('company'), updateStatusRules, validate, ctrl.updateStatus);

// ── Student or Company ────────────────────────────────────────────────────────
router.get('/:id',         authenticate, ctrl.getOne);
router.get('/:id/history', authenticate, ctrl.getHistory);

module.exports = router;
