const { prisma } = require('../config/database');
const Joi = require('joi');

const offerFiltersSchema = Joi.object({
  category: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  q: Joi.string().allow('').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
});

const createOfferSchema = Joi.object({
  title: Joi.string().trim().min(3).max(160).required(),
  description: Joi.string().trim().min(20).required(),
  salary: Joi.string().max(80).allow('').optional(),
  location: Joi.string().max(120).allow('').optional(),
  category: Joi.string().max(120).allow('').optional(),
  languages: Joi.array().items(Joi.string().max(50)).default([]),
  image: Joi.string().uri().allow('').optional(),
});

const getOffers = async (filters = {}) => {
  const { error, value } = offerFiltersSchema.validate(filters, { stripUnknown: true });
  if (error) throw new Error(error.details[0].message);

  const { category, location, q, page, limit } = value;
  const where = {};

  if (category) where.category = category;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { company: { user: { name: { contains: q, mode: 'insensitive' } } } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      include: {
        company: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.offer.count({ where }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const getOfferById = async (id) => {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      company: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
      applications: true,
    },
  });
};

const applyToOffer = async (studentId, offerId, additionalData = {}) => {
  const existing = await prisma.application.findUnique({
    where: { studentId_offerId: { studentId, offerId } },
  });
  if (existing) throw new Error('Already applied');

  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) throw new Error('Offer not found');

  return prisma.application.create({
    data: {
      studentId,
      offerId,
      ...additionalData,
    },
  });
};

const createOffer = async (companyId, offerData) => {
  const { error, value } = createOfferSchema.validate(offerData, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) throw new Error(error.details.map((d) => d.message).join(', '));

  const created = await prisma.offer.create({
    data: {
      companyId,
      ...value,
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
    global.io.emit('new-offer', created);
  }

  return created;
};

const deleteOffer = async (offerId, userId) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Company profile required');

  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) throw new Error('Offer not found');
  if (offer.companyId !== company.id) throw new Error('Unauthorized');

  await prisma.offer.delete({ where: { id: offerId } });
  return { id: offerId, deleted: true };
};

module.exports = {
  getOffers,
  getOfferById,
  applyToOffer,
  createOffer,
  deleteOffer,
};
