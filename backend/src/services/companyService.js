const { prisma } = require('../config/database');

const getCompanyProfile = async (userId) => {
  const company = await prisma.company.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!company) throw new Error('Company not found');
  return company;
};

const updateCompanyProfile = async (userId, data) => {
  return await prisma.company.update({
    where: { userId },
    data,
  });
};

const createOffer = async (userId, data) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  return await prisma.offer.create({
    data: {
      ...data,
      companyId: company.id,
    },
  });
};

const getOffers = async (userId) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  return await prisma.offer.findMany({
    where: { companyId: company.id },
    include: { applications: { include: { student: { include: { user: true } } } } },
  });
};

const getApplicants = async (userId) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  const offers = await prisma.offer.findMany({
    where: { companyId: company.id },
    include: {
      applications: {
        include: { student: { include: { user: true } } },
      },
    },
  });
  // Flatten applicants
  const applicants = [];
  offers.forEach(offer => {
    offer.applications.forEach(app => {
      applicants.push({ ...app, offer: { title: offer.title, id: offer.id } });
    });
  });
  return applicants;
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  createOffer,
  getOffers,
  getApplicants,
};
const getPublicCompanyProfile = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { 
      user: { select: { name: true, email: true } },
      offers: {
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Last 30 days
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    },
  });
  if (!company) throw new Error('Company not found');
  return company;
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  createOffer,
  getOffers,
  getApplicants,
  getPublicCompanyProfile,
};
