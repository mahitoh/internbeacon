const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/multer');
const {
  uploadStudentAvatarController,
  uploadCompanyLogoController,
  uploadCompanyCoverController,
} = require('../controllers/uploadController');

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/student/avatar',
  authorizeRole(['STUDENT']),
  (req, _res, next) => {
    req.uploadType = 'image';
    next();
  },
  upload.single('image'),
  uploadStudentAvatarController,
);

router.post(
  '/company/logo',
  authorizeRole(['COMPANY']),
  (req, _res, next) => {
    req.uploadType = 'image';
    next();
  },
  upload.single('image'),
  uploadCompanyLogoController,
);

router.post(
  '/company/cover',
  authorizeRole(['COMPANY']),
  (req, _res, next) => {
    req.uploadType = 'image';
    next();
  },
  upload.single('image'),
  uploadCompanyCoverController,
);

module.exports = router;
