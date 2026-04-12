const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getUserChatRooms,
  getRoomMessages,
  sendMessageToRoom,
  createRoom
} = require('../controllers/chatController');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's chat rooms
router.get('/rooms', getUserChatRooms);

// Create a new chat room
router.post('/rooms', [
  body('participants').isArray({ min: 1 }).withMessage('Participants must be an array'),
  body('participants.*').isString().withMessage('Each participant must be a string')
], createRoom);

// Get messages for a room
router.get('/rooms/:roomId/messages', getRoomMessages);

// Send a message to a room
router.post('/rooms/:roomId/messages', [
  body('content').isString().isLength({ min: 1, max: 1000 }).withMessage('Message content must be 1-1000 characters')
], sendMessageToRoom);

module.exports = router;