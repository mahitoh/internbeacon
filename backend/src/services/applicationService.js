const { prisma } = require('../config/database');
const { createNotification } = require('./notificationService');

const updateApplicationStatus = async (applicationId, status, userId) => {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { offer: { include: { company: { include: { user: true } } } }, student: { include: { user: true } } },
  });
  if (!app) throw new Error('Application not found');

  const company = await prisma.company.findUnique({ where: { userId } });
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

module.exports = { updateApplicationStatus };