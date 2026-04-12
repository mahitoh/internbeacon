const { prisma } = require('../config/database');

const getStudentProfile = async (userId) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!student) throw new Error('Student not found');
  return student;
};

const updateStudentProfile = async (userId, data) => {
  const { bio, skills } = data;
  return await prisma.student.update({
    where: { userId },
    data: { bio, skills, profileStrength: calculateStrength(data) },
  });
};

const calculateStrength = (data) => {
  // Simple calculation, e.g. based on filled fields
  let strength = 0;
  if (data.bio) strength += 30;
  if (data.skills && data.skills.length > 0) strength += 40;
  // Add more logic
  return Math.min(strength + 30, 100); // +30 for basic
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
    saved: 0, // Implement later if needed
  };

  return stats;
};

const getApplications = async (studentId) => {
  return await prisma.application.findMany({
    where: { studentId },
    include: {
      offer: {
        include: { company: { include: { user: true } } },
      },
    },
  });
};

const getRecommendations = async (studentId) => {
  // Get top matches
  const matches = await prisma.match.findMany({
    where: { studentId },
    orderBy: { score: 'desc' },
    take: 3,
    include: {
      offer: {
        include: { company: { include: { user: true } } },
      },
    },
  });

  return matches.map(m => ({
    ...m.offer,
    matchScore: m.score,
  }));
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getDashboardStats,
  getApplications,
  getRecommendations,
};