const router       = require('express').Router();
const ctrl         = require('../controllers/analyticsController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');

router.get('/',        authenticate, authorize('student'), ctrl.studentAnalytics);
router.get('/company', authenticate, authorize('company'), ctrl.companyAnalytics);

module.exports = router;
