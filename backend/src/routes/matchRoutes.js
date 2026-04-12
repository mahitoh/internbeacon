const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getStudentMatches,
  getOfferMatches,
  createOrUpdateMatch,
  calculateAndCreateMatch
} = require('../controllers/matchController');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get matches for current student
router.get('/student', authorizeRole(['STUDENT']), getStudentMatches);

// Get matches for an offer (companies can see matches for their offers)
router.get('/offer/:offerId', authorizeRole(['COMPANY']), getOfferMatches);

// Create or update a match (admin or system)
router.post('/', authorizeRole(['ADMIN']), [
  body('studentId').isString().withMessage('Student ID is required'),
  body('offerId').isString().withMessage('Offer ID is required'),
  body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
], createOrUpdateMatch);

// Calculate and create match
router.post('/calculate', authorizeRole(['ADMIN']), [
  body('studentId').isString().withMessage('Student ID is required'),
  body('offerId').isString().withMessage('Offer ID is required')
], calculateAndCreateMatch);

module.exports = router;