const { prisma } = require('../config/database');
const { createNotification } = require('./notificationService');

const updateApplicationStatus = async (applicationId, status, userId) => {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { offer: { include: { company: { include: { user: true } } } }, student: { include: { user: true } } },
  });
  if (!app) throw new Error('Application not found');

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Unauthorized');
  if (app.offer.companyId !== company.id) throw new Error('Unauthorized');

  const updatedApp = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  // Send notification to student
  const message = `Your application for ${app.offer.title} at ${app.offer.company.user.name} has been ${status.toLowerCase()}.`;
  await createNotification(app.student.userId, message, 'IN_APP');
  await createNotification(app.student.userId, message, 'EMAIL');

  return updatedApp;
};

const applyToOffer = async (userId, offerId, additionalData = {}) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true } } },
  });
  if (!student) throw new Error('Student profile not found');

  const existing = await prisma.application.findUnique({
    where: { studentId_offerId: { studentId: student.id, offerId } },
  });
  if (existing) throw new Error('Already applied');

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { company: { include: { user: true } } },
  });
  if (!offer) throw new Error('Offer not found');

  const application = await prisma.application.create({
    data: {
      studentId: student.id,
      offerId,
      ...additionalData,
    },
    include: {
      offer: {
        include: {
          company: {
            include: {
              user: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
          },
        },
      },
      student: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
    },
  });

  const message = `${student.user.name} applied for ${offer.title}.`;
  await createNotification(offer.company.userId, message, 'IN_APP');
  await createNotification(offer.company.userId, message, 'EMAIL');

  return application;
};

const getApplicationByIdForStudent = async (applicationId, userId) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error('Student not found');

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      offer: {
        include: {
          company: {
            include: {
              user: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
          },
        },
      },
      student: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!application || application.studentId !== student.id) {
    throw new Error('Application not found');
  }

  return application;
};

module.exports = {
  updateApplicationStatus,
  applyToOffer,
  getApplicationByIdForStudent,
};