const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getPublicProfile,
  getPublicList,
  getProfile,
  updateProfile,
  postOffer,
  getCompanyOffers,
  getApps,
} = require('../controllers/companyController');

const router = express.Router();

// Public route (must be declared before auth middleware)
router.get('/', getPublicList);
router.get('/public/:id', getPublicProfile);

router.use(authenticateToken);
router.use(authorizeRole(['COMPANY']));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/offers', postOffer);
router.get('/offers', getCompanyOffers);
router.get('/applicants', getApps);

module.exports = router;
