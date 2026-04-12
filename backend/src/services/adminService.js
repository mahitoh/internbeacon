const { prisma } = require('../config/database');

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return users;
};

const getAllOffers = async () => {
  const offers = await prisma.offer.findMany({
    include: {
      company: {
        include: {
          user: {
            select: { name: true }
          }
        }
      },
      applications: {
        select: { id: true, status: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return offers;
};

const getStats = async () => {
  const [userCount, studentCount, companyCount, offerCount, applicationCount] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.company.count(),
    prisma.offer.count(),
    prisma.application.count()
  ]);

  return {
    totalUsers: userCount,
    totalStudents: studentCount,
    totalCompanies: companyCount,
    totalOffers: offerCount,
    totalApplications: applicationCount
  };
};

const deleteUser = async (userId) => {
  // This will cascade delete due to schema relations
  await prisma.user.delete({
    where: { id: userId }
  });

  return { success: true };
};

const deleteOffer = async (offerId) => {
  await prisma.offer.delete({
    where: { id: offerId }
  });

  return { success: true };
};

module.exports = {
  getAllUsers,
  getAllOffers,
  getStats,
  deleteUser,
  deleteOffer
};