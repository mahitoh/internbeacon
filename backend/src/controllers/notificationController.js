const { createNotification, getNotifications, markAsRead } = require('../services/notificationService');

const getAll = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const data = await getNotifications(req.user.id, page, limit);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get notifications error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRead(req.user.id, id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    global.logger?.error('Mark notification read error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendTest = async (req, res) => {
  try {
    const { message = 'Test notification from InternBeacon', type = 'IN_APP' } = req.body || {};
    const data = await createNotification(req.user.id, message, type);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Create test notification error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, markRead, sendTest };
