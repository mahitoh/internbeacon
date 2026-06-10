const router = require('express').Router();
const ctrl   = require('../controllers/profilesController');

// Public — no auth required
router.get('/',    ctrl.listCompanies);
router.get('/:id', ctrl.getCompanyPublic);

module.exports = router;
