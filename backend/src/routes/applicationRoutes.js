const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { updateStatus } = require('../controllers/applicationController');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['COMPANY']));

router.put('/status', updateStatus);

module.exports = router;