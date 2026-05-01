const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { apply, getById, updateStatus } = require('../controllers/applicationController');

const router = express.Router();

router.use(authenticateToken);

router.post('/:offerId/apply', authorizeRole(['STUDENT']), apply);
router.get('/:id', authorizeRole(['STUDENT']), getById);

router.use(authorizeRole(['COMPANY']));

router.put('/status', updateStatus);

module.exports = router;