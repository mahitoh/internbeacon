const { createChatRoom, getChatRooms, getMessages, sendMessage } = require('../services/chatService');

const getUserChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await getChatRooms(userId);
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const messages = await getMessages(roomId, userId);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

const sendMessageToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const message = await sendMessage(roomId, senderId, content);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { participants } = req.body;
    const userId = req.user.id;

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ success: false, message: 'At least two participants required' });
    }

    // Ensure current user is included
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const room = await createChatRoom(participants);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserChatRooms,
  getRoomMessages,
  sendMessageToRoom,
  createRoom
};