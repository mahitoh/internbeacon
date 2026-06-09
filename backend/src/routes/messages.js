const router       = require('express').Router();
const ctrl         = require('../controllers/messagesController');
const authenticate = require('../middleware/authenticate');

// All message routes require authentication
router.use(authenticate);

router.get('/unread-count',   ctrl.unreadCount);
router.get('/threads',        ctrl.listThreads);
router.get('/app/:appId',     ctrl.listThread);
router.post('/app/:appId',    ctrl.send);
router.patch('/:id/read',     ctrl.markRead);

module.exports = router;
