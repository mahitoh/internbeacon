const express = require('express');
const { registerUser, loginUser, refreshToken, getMe } = require('../controllers/authController');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('role').optional().isIn(['STUDENT', 'COMPANY']),
], registerUser);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
], loginUser);

// Refresh token
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getMe);

module.exports = router;