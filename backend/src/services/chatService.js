const { prisma } = require('../config/database');

const createChatRoom = async (participants) => {
  // Ensure participants are unique and sorted for consistency
  const uniqueParticipants = [...new Set(participants)].sort();

  // Check if room already exists
  const existingRoom = await prisma.chatRoom.findFirst({
    where: {
      participants: {
        equals: uniqueParticipants
      }
    }
  });

  if (existingRoom) {
    return existingRoom;
  }

  const room = await prisma.chatRoom.create({
    data: {
      participants: uniqueParticipants
    }
  });

  return room;
};

const getChatRooms = async (userId) => {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      participants: {
        has: userId
      }
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1 // Get last message for preview
      }
    },
    orderBy: {
      createdAt: 'desc' // Assuming we add createdAt to ChatRoom
    }
  });

  // Add user info for other participants
  const roomsWithUsers = await Promise.all(
    rooms.map(async (room) => {
      const otherParticipantId = room.participants.find(p => p !== userId);
      const otherUser = await prisma.user.findUnique({
        where: { id: otherParticipantId },
        select: { id: true, name: true, email: true }
      });

      return {
        ...room,
        otherParticipant: otherUser
      };
    })
  );

  return roomsWithUsers;
};

const getMessages = async (roomId, userId) => {
  // Verify user is participant
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    select: { participants: true }
  });

  if (!room || !room.participants.includes(userId)) {
    throw new Error('Access denied');
  }

  const messages = await prisma.message.findMany({
    where: { roomId },
    include: {
      sender: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return messages;
};

const sendMessage = async (roomId, senderId, content) => {
  // Verify sender is participant
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    select: { participants: true }
  });

  if (!room || !room.participants.includes(senderId)) {
    throw new Error('Access denied');
  }

  const message = await prisma.message.create({
    data: {
      roomId,
      senderId,
      content
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  // TODO: Emit socket event for real-time updates
  // For now, return the message

  return message;
};

module.exports = {
  createChatRoom,
  getChatRooms,
  getMessages,
  sendMessage
};