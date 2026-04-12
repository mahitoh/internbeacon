const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { optimizeResume } = require('../controllers/aiController');
const { body } = require('express-validator');

const router = express.Router();

// All AI routes require authentication
router.use(authenticateToken);

// Resume optimization
router.post('/resume-optimize', [
  body('resumeText').isString().isLength({ min: 10, max: 10000 }).withMessage('Resume text must be 10-10000 characters'),
  body('jobDescription').optional().isString().isLength({ max: 5000 }).withMessage('Job description too long')
], optimizeResume);

module.exports = router;