const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getStats,
  getApps,
  getRecs,
  listSchools,
  getAppById,
} = require('../controllers/studentController');

const router = express.Router();

router.get('/schools', listSchools);

// All student routes require authentication and STUDENT role
router.use(authenticateToken);
router.use(authorizeRole(['STUDENT']));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);
router.get('/applications', getApps);
router.get('/applications/:id', getAppById);
router.get('/recommendations', getRecs);

module.exports = router;
