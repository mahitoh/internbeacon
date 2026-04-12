const express = require('express');
const { getPublicProfile,  authenticateToken, authorizeRole } = require('../middleware/auth');
nst { getPublicCompanyProfile } = require("../services/companyService");
const { getPublicProfile, 
nst { getPublicCompanyProfile } = require("../services/companyService");
  getProfile,
  updateProfile,
  postOffer,
  getCompanyOffers,
  getApps,
} = require('../controllers/companyController');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['COMPANY']));
outer.get("/public/:id", getPublicProfile);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/offers', postOffer);
router.get('/offers', getCompanyOffers);
router.get('/applicants', getApps);

module.exports = router;