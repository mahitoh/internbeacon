const router     = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const ctrl         = require('../controllers/uploadController');

router.post('/cv',     authenticate, authorize('student'), ctrl.cvMiddleware,    ctrl.uploadCv);
router.post('/avatar', authenticate, authorize('student'), ctrl.imageMiddleware, ctrl.uploadAvatar);
router.post('/logo',   authenticate, authorize('company'), ctrl.imageMiddleware, ctrl.uploadLogo);
router.get('/cv-url/:studentUserId', authenticate, ctrl.getCvSignedUrl);

module.exports = router;
