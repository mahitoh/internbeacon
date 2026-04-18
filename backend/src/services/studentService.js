const { prisma } = require('../config/database');
const Joi = require('joi');

const getStudentProfile = async (userId) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!student) throw new Error('Student not found');
  return student;
};

const updateStudentProfileSchema = Joi.object({
  bio: Joi.string().max(500).optional(),
  skills: Joi.array().items(Joi.string()).max(20).optional(),
});

const updateStudentProfile = async (userId, data) => {
  const { error } = updateStudentProfileSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  const { bio, skills } = data;
  return await prisma.student.update({
    where: { userId },
    data: { bio, skills, profileStrength: calculateStrength(data) },
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
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    saved: 0,
  };

  return stats;
};

const getApplications = async (studentId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await prisma.application.findMany({
    where: { studentId },
    include: {
      offer: {
        include: { company: { include: { user: true } } },
      },
    },
    skip,
    take: limit,
  });
};

const getRecommendations = async (studentId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const matches = await prisma.match.findMany({
    where: { studentId },
    orderBy: { score: 'desc' },
    skip,
    take: limit,
  });

  if (matches.length === 0) return [];

  const offerIds = [...new Set(matches.map(m => m.offerId))];
  const offers = await prisma.offer.findMany({
    where: { id: { in: offerIds } },
    include: { company: { include: { user: true } } },
  });

  const offersById = new Map(offers.map(offer => [offer.id, offer]));

  return matches
    .map(m => {
      const offer = offersById.get(m.offerId);
      if (!offer) return null;
      return {
        ...offer,
        matchScore: m.score,
      };
    })
    .filter(Boolean);
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getDashboardStats,
  getApplications,
  getRecommendations,
};