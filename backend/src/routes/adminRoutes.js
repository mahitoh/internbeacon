const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getUsers,
  getOffers,
  getDashboardStats,
  removeUser,
  removeOffer
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRole(['ADMIN']));

// Get dashboard stats
router.get('/stats', getDashboardStats);

// Get all users
router.get('/users', getUsers);

// Get all offers
router.get('/offers', getOffers);

// Delete user
router.delete('/users/:userId', removeUser);

// Delete offer
router.delete('/offers/:offerId', removeOffer);

module.exports = router;