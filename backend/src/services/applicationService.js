const { prisma } = require('../config/database');

const updateApplicationStatus = async (applicationId, status, userId) => {
  // Check if company owns the offer
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { offer: true },
  });
  if (!app) throw new Error('Application not found');

  const company = await prisma.company.findUnique({ where: { userId } });
  if (app.offer.companyId !== company.id) throw new Error('Unauthorized');

  return await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
};

module.exports = { updateApplicationStatus };