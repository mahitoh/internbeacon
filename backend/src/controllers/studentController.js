const {
  getStudentProfile,
  updateStudentProfile,
  getDashboardStats,
  getApplications,
  getRecommendations,
} = require('../services/studentService');

const getProfile = async (req, res) => {
  try {
    const data = await getStudentProfile(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get profile error:', error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await updateStudentProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Update profile error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    const data = await getDashboardStats(student.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApps = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    const data = await getApplications(student.id, parseInt(page), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get apps error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    const data = await getRecommendations(student.id, parseInt(page), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get recs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getStats, getApps, getRecs };