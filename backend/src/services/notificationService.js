const { prisma } = require('../config/database');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createNotification = async (userId, message, type = 'IN_APP') => {
  const notification = await prisma.notification.create({
    data: { userId, message, type },
  });

  if (type === 'EMAIL') {
    await sendEmail(userId, message);
  }

  // Emit real-time for in-app
  if (global.io && type === 'IN_APP') {
    global.io.to(userId).emit('notification', notification);
  }

  return notification;
};

const sendEmail = async (userId, message) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'InternBeacon Notification',
    text: message,
  });

  await prisma.notification.updateMany({
    where: { userId, message, type: 'EMAIL' },
    data: { sent: true },
  });
};

const getNotifications = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });
};

const markAsRead = async (userId, notificationId) => {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};