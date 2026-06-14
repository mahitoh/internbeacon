const router       = require('express').Router();
const ctrl         = require('../controllers/offersController');
const authenticate         = require('../middleware/authenticate');
const authenticateOptional = require('../middleware/authenticateOptional');
const authorize            = require('../middleware/authorize');
const validate     = require('../middleware/validate');
const {
  createOfferRules,
  updateOfferRules,
} = require('../utils/validators');

// ── Public (with optional auth for match scoring) ─────────────────────────────
router.get('/',               authenticateOptional, ctrl.list);
router.get('/bookmarks',      authenticate, authorize('student'), ctrl.listBookmarks);
router.get('/recommended',    authenticate, authorize('student'), ctrl.recommended);
router.get('/my',             authenticate, authorize('company'), ctrl.myOffers);
router.get('/:id',            authenticateOptional, ctrl.get);

// ── Company only ──────────────────────────────────────────────────────────────
router.post('/',    authenticate, authorize('company'), createOfferRules, validate, ctrl.create);
router.patch('/:id', authenticate, authorize('company'), updateOfferRules, validate, ctrl.update);
router.delete('/:id', authenticate, authorize('company'), ctrl.remove);

// ── Student only ──────────────────────────────────────────────────────────────
router.post('/:id/bookmark',   authenticate, authorize('student'), ctrl.bookmark);
router.delete('/:id/bookmark', authenticate, authorize('student'), ctrl.unbookmark);

module.exports = router;
