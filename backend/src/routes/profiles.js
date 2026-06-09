const router       = require('express').Router();
const ctrl         = require('../controllers/profilesController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');

// ── Authenticated — view any profile ─────────────────────────────────────────
router.get('/student/:id', authenticate, ctrl.getStudent);
router.get('/company/:id', authenticate, ctrl.getCompany);

// ── Role-specific updates ─────────────────────────────────────────────────────
router.patch('/student', authenticate, authorize('student'), ctrl.updateStudent);
router.patch('/company', authenticate, authorize('company'), ctrl.updateCompany);

module.exports = router;
