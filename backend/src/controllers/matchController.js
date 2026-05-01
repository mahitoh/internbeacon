const { createMatch, getMatchesForStudent, getMatchesForOffer, calculateMatchScore } = require('../services/matchService');

const getStudentMatches = async (req, res) => {
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id }
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const matches = await getMatchesForStudent(student.id);
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOfferMatches = async (req, res) => {
  try {
    const { offerId } = req.params;
    const matches = await getMatchesForOffer(offerId);
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrUpdateMatch = async (req, res) => {
  try {
    const { studentId, offerId, score } = req.body;

    if (score !== undefined && (score < 0 || score > 100)) {
      return res.status(400).json({ success: false, message: 'Score must be between 0 and 100' });
    }

    const finalScore = score !== undefined ? score : await calculateMatchScore(studentId, offerId);

    const match = await createMatch(studentId, offerId, finalScore);
    res.status(201).json({ success: true, data: match });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const calculateAndCreateMatch = async (req, res) => {
  try {
    const { studentId, offerId } = req.body;

    const score = await calculateMatchScore(studentId, offerId);
    const match = await createMatch(studentId, offerId, score);

    res.status(201).json({ success: true, data: match });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentMatches,
  getOfferMatches,
  createOrUpdateMatch,
  calculateAndCreateMatch
};