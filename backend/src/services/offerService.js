const { prisma } = require('../config/database');

const getOffers = async (filters = {}) => {
  const { category, location } = filters;
  const where = {};
  if (category) where.category = category;
  if (location) where.location = { contains: location };
  return await prisma.offer.findMany({
    where,
    include: { company: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getOfferById = async (id) => {
  return await prisma.offer.findUnique({
    where: { id },
    include: { company: { include: { user: true } }, applications: true },
  });
};

const applyToOffer = async (studentId, offerId, additionalData = {}) => {
  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: { studentId_offerId: { studentId, offerId } },
  });
  if (existing) throw new Error('Already applied');

  const applicationData = {
    studentId,
    offerId,
    ...additionalData
  };

  return await prisma.application.create({
    data: applicationData,
  });
};

module.exports = { getOffers, getOfferById, applyToOffer };
const createOffer = async (companyId, offerData) => {
  return await prisma.offer.create({
    data: {
      companyId,
      ...offerData
    },
    include: { company: { include: { user: true } } }
  });
};

module.exports = { getOffers, getOfferById, applyToOffer, createOffer };
