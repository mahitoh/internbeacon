const {
  getCompanyProfile,
  updateCompanyProfile,
  createOffer,
  getOffers,
  getApplicants,
  getPublicCompanyProfile,
} = require('../services/companyService');

const getProfile = async (req, res) => {
  try {
    const data = await getCompanyProfile(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get company profile error', { message: error.message });
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await updateCompanyProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Update company profile error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const postOffer = async (req, res) => {
  try {
    const data = await createOffer(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Post offer error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCompanyOffers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const data = await getOffers(req.user.id, page, limit);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get company offers error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApps = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const data = await getApplicants(req.user.id, page, limit);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get applicants error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getPublicCompanyProfile(id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get public profile error', { message: error.message });
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  postOffer,
  getCompanyOffers,
  getApps,
  getPublicProfile,
};
