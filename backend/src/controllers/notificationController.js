const { createNotification, getNotifications, markAsRead } = require('../services/notificationService');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getNotifications(req.user.id, parseInt(page), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRead(req.user.id, id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    global.logger?.error('Mark read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, markRead };