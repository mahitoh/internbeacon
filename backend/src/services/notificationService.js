const { prisma } = require('../config/database');
const emailService = require('./emailService');
const smsService = require('./smsService');

const createNotification = async (userId, message, type = 'IN_APP') => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      type,
    }
  });

  return notification;
};

const sendNotification = async (userId, message, type = 'IN_APP', email = null, phone = null) => {
  const notification = await createNotification(userId, message, type);

  let sent = false;

  if (type === 'EMAIL' && email) {
    const emailResult = await emailService.sendEmail(email, 'InternBeacon Notification', `<p>${message}</p>`);
    sent = emailResult.success;
  } else if (type === 'SMS' && phone) {
    const smsResult = await smsService.sendSMS(phone, message);
    sent = smsResult.success;
  } else {
    // For IN_APP, it's always "sent" since it's stored
    sent = true;
  }

  if (sent) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: { sent: true }
    });
  }

  return { ...notification, sent };
};

const getUserNotifications = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return notifications;
};

const markAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification || notification.userId !== userId) {
    throw new Error('Notification not found');
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  });

  return updatedNotification;
};

const markAllAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });

  return { success: true };
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification || notification.userId !== userId) {
    throw new Error('Notification not found');
  }

  await prisma.notification.delete({
    where: { id: notificationId }
  });

  return { success: true };
};

module.exports = {
  createNotification,
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};