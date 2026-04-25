const { prisma } = require('../config/database');
const Joi = require('joi');

const updateCompanyProfileSchema = Joi.object({
  description: Joi.string().max(2000).allow('').optional(),
  website: Joi.string().uri().allow('').optional(),
  industry: Joi.string().max(120).allow('').optional(),
  city: Joi.string().max(120).allow('').optional(),
  name: Joi.string().trim().min(2).max(100).optional(),
});

const createOfferSchema = Joi.object({
  title: Joi.string().trim().min(3).max(160).required(),
  description: Joi.string().trim().min(20).required(),
  location: Joi.string().max(120).optional(),
  salary: Joi.string().max(80).allow('').optional(),
  category: Joi.string().max(120).allow('').optional(),
  languages: Joi.array().items(Joi.string().max(50)).default([]),
  image: Joi.string().uri().allow('').optional(),
});

const getCompanyProfile = async (userId) => {
  const company = await prisma.company.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  });

  if (!company) throw new Error('Company not found');
  return company;
};

const updateCompanyProfile = async (userId, data) => {
  const { error, value } = updateCompanyProfileSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) throw new Error(error.details.map((d) => d.message).join(', '));

  const updates = { ...value };
  const name = updates.name;
  delete updates.name;

  return prisma.$transaction(async (tx) => {
    if (name !== undefined) {
      await tx.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    const updated = await tx.company.update({
      where: { userId },
      data: updates,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return updated;
  });
};

const createOffer = async (userId, data) => {
  const { error, value } = createOfferSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) throw new Error(error.details.map((d) => d.message).join(', '));

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Company profile not found');

  const offer = await prisma.offer.create({
    data: {
      ...value,
      companyId: company.id,
      languages: value.languages || [],
    },
    include: {
      company: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
    },
  });

  if (global.io) {
    global.io.emit('new-offer', offer);
  }

  return offer;
};

const getOffers = async (userId, page = 1, limit = 10) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Company profile not found');

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.offer.findMany({
      where: { companyId: company.id },
      include: {
        applications: {
          include: { student: { include: { user: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.offer.count({ where: { companyId: company.id } }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const getApplicants = async (userId, page = 1, limit = 10) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Company profile not found');

  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { offer: { companyId: company.id } },
      include: {
        student: { include: { user: true, school: true } },
        offer: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.application.count({ where: { offer: { companyId: company.id } } }),
  ]);

  return {
    items: applications,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const getPublicCompanyProfile = async (companyId) => {
  const cacheKey = `public-company-${companyId}`;
  const cached = global.cache?.get(cacheKey);
  if (cached) return cached;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: { select: { name: true, email: true, avatarUrl: true } },
      offers: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!company) throw new Error('Company not found');
  global.cache?.set(cacheKey, company);
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
