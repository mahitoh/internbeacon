const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getAll, markRead, sendTest } = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticateToken);
router.get('/', getAll);
router.put('/:id/read', markRead);
router.post('/test', sendTest);

module.exports = router;
