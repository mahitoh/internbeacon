const {
  getStudentProfile,
  updateStudentProfile,
  getDashboardStats,
  getApplications,
  getRecommendations,
  getSchools,
} = require('../services/studentService');
const { getApplicationByIdForStudent } = require('../services/applicationService');

const getProfile = async (req, res) => {
  try {
    const data = await getStudentProfile(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get profile error', { message: error.message });
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await updateStudentProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Update profile error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const data = await getDashboardStats(student.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get stats error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApps = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const data = await getApplications(student.id, page, limit);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get apps error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecs = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const data = await getRecommendations(student.id, page, limit);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get recs error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const listSchools = async (_req, res) => {
  try {
    const data = await getSchools();
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('List schools error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAppById = async (req, res) => {
  try {
    const data = await getApplicationByIdForStudent(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get application by id error', { message: error.message });
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats,
  getApps,
  getRecs,
  listSchools,
  getAppById,
};
