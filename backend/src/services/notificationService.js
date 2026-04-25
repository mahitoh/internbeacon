const { prisma } = require('../config/database');
const nodemailer = require('nodemailer');

const hasEmailConfig = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const createNotification = async (userId, message, type = 'IN_APP') => {
  const notification = await prisma.notification.create({
    data: { userId, message, type },
  });

  if (type === 'EMAIL') {
    await sendEmail(userId, message);
  }

  if (global.io && type === 'IN_APP') {
    global.io.emit(`notification:${userId}`, notification);
  }

  return notification;
};

const sendEmail = async (userId, message) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  if (!transporter) {
    global.logger?.warn('Email skipped: transporter not configured', { userId });
    return;
  }

  try {
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
  } catch (error) {
    global.logger?.error('Email send error', { message: error.message, userId });
  }
};

const getNotifications = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const markAsRead = async (userId, notificationId) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};
