const { prisma } = require('../config/database');
const Joi = require('joi');

const updateStudentProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).optional(),
  bio: Joi.string().max(500).allow('').optional(),
  skills: Joi.array().items(Joi.string().max(60)).max(30).optional(),
  city: Joi.string().max(120).allow('').optional(),
  schoolId: Joi.string().optional(),
});

const getStudentProfile = async (userId) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      school: true,
    },
  });
  if (!student) throw new Error('Student not found');
  return student;
};

const updateStudentProfile = async (userId, data) => {
  const { error, value } = updateStudentProfileSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) throw new Error(error.details.map((d) => d.message).join(', '));

  const existing = await prisma.student.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } }, school: true },
  });
  if (!existing) throw new Error('Student not found');

  const nextBio = value.bio !== undefined ? value.bio : existing.bio;
  const nextSkills = value.skills !== undefined ? value.skills : existing.skills;
  const nextStrength = calculateStrength({ bio: nextBio, skills: nextSkills });

  return prisma.$transaction(async (tx) => {
    if (value.name !== undefined) {
      await tx.user.update({
        where: { id: userId },
        data: { name: value.name },
      });
    }

    const updatedStudent = await tx.student.update({
      where: { userId },
      data: {
        bio: value.bio !== undefined ? value.bio : undefined,
        skills: value.skills !== undefined ? value.skills : undefined,
        city: value.city !== undefined ? value.city : undefined,
        schoolId: value.schoolId !== undefined ? value.schoolId : undefined,
        profileStrength: nextStrength,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        school: true,
      },
    });

    return updatedStudent;
  });
};

const calculateStrength = (data) => {
  let strength = 0;
  if (data.bio) strength += 30;
  if (data.skills && data.skills.length > 0) strength += 40;
  return Math.min(strength + 30, 100);
};

const getDashboardStats = async (studentId) => {
  const applications = await prisma.application.findMany({
    where: { studentId },
    select: { status: true },
  });

  const stats = {
    applications: applications.length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    saved: 0,
  };

  return stats;
};

const getApplications = async (studentId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where: { studentId },
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
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.application.count({ where: { studentId } }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const getRecommendations = async (studentId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [matches, total] = await Promise.all([
    prisma.match.findMany({
      where: { studentId },
      orderBy: { score: 'desc' },
      skip,
      take: limit,
    }),
    prisma.match.count({ where: { studentId } }),
  ]);

  if (matches.length === 0) {
    return { items: [], page, limit, total: 0, totalPages: 1 };
  }

  const offerIds = [...new Set(matches.map((m) => m.offerId))];
  const offers = await prisma.offer.findMany({
    where: { id: { in: offerIds } },
    include: {
      company: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
    },
  });

  const offersById = new Map(offers.map((offer) => [offer.id, offer]));
  const items = matches
    .map((m) => {
      const offer = offersById.get(m.offerId);
      if (!offer) return null;
      return {
        ...offer,
        matchScore: m.score,
      };
    })
    .filter(Boolean);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const getSchools = async () => {
  return prisma.school.findMany({
    orderBy: [{ city: 'asc' }, { name: 'asc' }],
  });
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getDashboardStats,
  getApplications,
  getRecommendations,
  getSchools,
};
