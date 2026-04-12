const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getProfileProgress,
  getApplicationProgress,
  getOverallProgressData
} = require('../controllers/progressController');

const router = express.Router();

// All progress routes require authentication
router.use(authenticateToken);

// Profile completion progress
router.get('/profile', authorizeRole(['STUDENT']), getProfileProgress);

// Application statistics
router.get('/applications', authorizeRole(['STUDENT']), getApplicationProgress);

// Overall progress dashboard
router.get('/overall', authorizeRole(['STUDENT']), getOverallProgressData);

module.exports = router;