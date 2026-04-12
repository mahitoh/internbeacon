const {
  createNotification,
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../services/notificationService');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUserNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const notification = await createNotification(userId, message);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendUserNotification = async (req, res) => {
  try {
    const { userId, message, type, email, phone } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!['IN_APP', 'EMAIL', 'SMS'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid notification type' });
    }

    const notification = await sendNotification(userId, message, type, email, phone);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await markAsRead(notificationId, userId);
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await markAllAsRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await deleteNotification(notificationId, userId);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  createUserNotification,
  sendUserNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification
};