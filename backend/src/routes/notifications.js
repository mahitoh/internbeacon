const router       = require('express').Router();
const ctrl         = require('../controllers/notificationsController');
const authenticate = require('../middleware/authenticate');

// All notification routes require authentication
router.use(authenticate);

router.get('/',               ctrl.list);
router.get('/unread-count',   ctrl.unreadCount);
router.patch('/read-all',     ctrl.markAllRead);
router.patch('/:id/read',     ctrl.markRead);
router.delete('/:id',         ctrl.remove);

module.exports = router;
