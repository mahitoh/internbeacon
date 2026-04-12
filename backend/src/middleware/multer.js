const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    cv: ['.pdf'],
    image: ['.jpg', '.jpeg', '.png', '.webp'],
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const type = req.uploadType || 'image';

  if (allowedTypes[type]?.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes[type]?.join(', ')}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;