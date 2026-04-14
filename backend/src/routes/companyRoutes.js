const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getPublicCompanyProfile } = require("../services/companyService");
const {
  getPublicProfile,
  getProfile,
  updateProfile,
  postOffer,
  getCompanyOffers,
  getApps,
} = require('../controllers/companyController');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['COMPANY']));

router.get("/public/:id", getPublicProfile);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/offers', postOffer);
router.get('/offers', getCompanyOffers);
router.get('/applicants', getApps);

module.exports = router;