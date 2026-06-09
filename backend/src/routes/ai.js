const router       = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctrl         = require('../controllers/aiController');

router.get('/providers',                  authenticate, ctrl.providers);
router.post('/parse-cv',                  authenticate, authorize('student'), ctrl.parseCv);
router.get('/match-offer/:offerId',       authenticate, authorize('student'), ctrl.matchOffer);
router.get('/rank-applicants/:offerId',   authenticate, authorize('company'), ctrl.rankApplicants);

module.exports = router;
