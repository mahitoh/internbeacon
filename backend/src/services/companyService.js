const { prisma } = require('../config/database');
const Joi = require('joi');

const getCompanyProfile = async (userId) => {
  const company = await prisma.company.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!company) throw new Error('Company not found');
  return company;
};

const updateCompanyProfileSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(1000).optional(),
  website: Joi.string().uri().optional(),
});

const updateCompanyProfile = async (userId, data) => {
  const { error } = updateCompanyProfileSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  return await prisma.company.update({
    where: { userId },
    data,
  });
};

const createOfferSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().optional(),
  salary: Joi.number().optional(),
  deadline: Joi.date().optional(),
});

const createOffer = async (userId, data) => {
  const { error } = createOfferSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  const company = await prisma.company.findUnique({ where: { userId } });
  const offer = await prisma.offer.create({
    data: {
      ...data,
      companyId: company.id,
    },
  });

  // Emit real-time update
  if (global.io) {
    global.io.emit('new-offer', offer);
  }

  return offer;
};

const getOffers = async (userId, page = 1, limit = 10) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  const skip = (page - 1) * limit;
  return await prisma.offer.findMany({
    where: { companyId: company.id },
    include: { applications: { include: { student: { include: { user: true } } } } },
    skip,
    take: limit,
  });
};

const getApplicants = async (userId, page = 1, limit = 10) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  const skip = (page - 1) * limit;
  const offers = await prisma.offer.findMany({
    where: { companyId: company.id },
    include: {
      applications: {
        include: { student: { include: { user: true } } },
        skip,
        take: limit,
      },
    },
  });

  const applicants = [];
  offers.forEach(offer => {
    offer.applications.forEach(app => {
      applicants.push({ ...app, offer: { title: offer.title, id: offer.id } });
    });
  });
  return applicants;
};

const getPublicCompanyProfile = async (companyId) => {
  const cacheKey = `public-company-${companyId}`;
  let company = global.cache?.get(cacheKey);
  if (!company) {
    company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        user: { select: { name: true, email: true } },
        offers: {
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    if (!company) throw new Error('Company not found');
    global.cache?.set(cacheKey, company);
  }
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