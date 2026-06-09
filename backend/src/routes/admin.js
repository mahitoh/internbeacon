const router       = require('express').Router();
const ctrl         = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// ── Dashboard ──────────────────────────────────────────────────────────────────
router.get('/stats', ctrl.stats);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get('/users',                 ctrl.listUsers);
router.get('/users/:id',             ctrl.getUser);
router.patch('/users/:id/activate',  ctrl.setActive);
router.patch('/users/:id/role',      ctrl.setRole);
router.delete('/users/:id',          ctrl.deleteUser);

// ── Offers ────────────────────────────────────────────────────────────────────
router.get('/offers',                ctrl.listOffers);
router.patch('/offers/:id/status',   ctrl.setOfferStatus);
router.delete('/offers/:id',         ctrl.deleteOffer);

// ── Applications ──────────────────────────────────────────────────────────────
router.get('/applications',          ctrl.listApplications);

// ── Company verification ──────────────────────────────────────────────────────
router.patch('/companies/:id/verify', ctrl.verifyCompany);

// ── Broadcast ─────────────────────────────────────────────────────────────────
router.post('/notifications/broadcast', ctrl.broadcast);

module.exports = router;
