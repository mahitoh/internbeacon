const {
  uploadStudentAvatar,
  uploadCompanyLogo,
  uploadCompanyCover,
} = require('../services/uploadService');

const uploadStudentAvatarController = async (req, res) => {
  try {
    const data = await uploadStudentAvatar(req.user.id, req.file);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Upload student avatar error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const uploadCompanyLogoController = async (req, res) => {
  try {
    const data = await uploadCompanyLogo(req.user.id, req.file);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Upload company logo error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const uploadCompanyCoverController = async (req, res) => {
  try {
    const data = await uploadCompanyCover(req.user.id, req.file);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Upload company cover error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadStudentAvatarController,
  uploadCompanyLogoController,
  uploadCompanyCoverController,
};
