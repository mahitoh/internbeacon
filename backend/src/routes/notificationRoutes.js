const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getNotifications,
  createUserNotification,
  sendUserNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification
} = require('../controllers/notificationController');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's notifications
router.get('/', getNotifications);

// Create notification (admin only)
router.post('/', authorizeRole(['ADMIN']), [
  body('userId').isString().withMessage('User ID is required'),
  body('message').isString().isLength({ min: 1 }).withMessage('Message is required')
], createUserNotification);

// Send notification (admin only)
router.post('/send', authorizeRole(['ADMIN']), [
  body('userId').isString().withMessage('User ID is required'),
  body('message').isString().isLength({ min: 1 }).withMessage('Message is required'),
  body('type').isIn(['IN_APP', 'EMAIL', 'SMS']).withMessage('Type must be IN_APP, EMAIL, or SMS'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').optional().isString().withMessage('Phone must be string')
], sendUserNotification);

// Mark notification as read
router.patch('/:notificationId/read', markNotificationRead);

// Mark all notifications as read
router.patch('/read-all', markAllNotificationsRead);

// Delete notification
router.delete('/:notificationId', removeNotification);

module.exports = router;