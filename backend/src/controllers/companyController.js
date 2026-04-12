const {
  getCompanyProfile,
  updateCompanyProfile,
  createOffer,
  getOffers,
  getApplicants,
} = require('../services/companyService');

const getProfile = async (req, res) => {
  try {
    const data = await getCompanyProfile(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get company profile error:', error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await updateCompanyProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Update company profile error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const postOffer = async (req, res) => {
  try {
    const data = await createOffer(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Post offer error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCompanyOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getOffers(req.user.id, parseInt(page), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get company offers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApps = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getApplicants(req.user.id, parseInt(page), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get applicants error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const { getPublicCompanyProfile } = require('../services/companyService');

const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getPublicCompanyProfile(id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get public profile error:', error);
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, postOffer, getCompanyOffers, getApps, getPublicProfile };