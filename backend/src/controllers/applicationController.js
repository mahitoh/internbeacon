const { updateApplicationStatus } = require('../services/applicationService');

const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const data = await updateApplicationStatus(id, status, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { updateStatus };