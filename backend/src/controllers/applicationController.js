const {
  updateApplicationStatus,
  applyToOffer,
  getApplicationByIdForStudent,
} = require('../services/applicationService');

const apply = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { coverLetter, resume, portfolio, availability } = req.body;
    const data = await applyToOffer(req.user.id, offerId, {
      coverLetter,
      resume,
      portfolio,
      availability,
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Apply application error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await getApplicationByIdForStudent(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get application by id error', { message: error.message });
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const data = await updateApplicationStatus(id, status, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { apply, getById, updateStatus };