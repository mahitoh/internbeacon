const { calculateProfileCompletion, getApplicationStats, getOverallProgress } = require('../services/progressService');

const getProfileProgress = async (req, res) => {
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const progress = await calculateProfileCompletion(student.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApplicationProgress = async (req, res) => {
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const stats = await getApplicationStats(student.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOverallProgressData = async (req, res) => {
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const progress = await getOverallProgress(student.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfileProgress,
  getApplicationProgress,
  getOverallProgressData
};