const { prisma } = require('../config/database');

const createMatch = async (studentId, offerId, score) => {
  // Check if match already exists
  const existingMatch = await prisma.match.findUnique({
    where: {
      studentId_offerId: {
        studentId,
        offerId
      }
    }
  });

  if (existingMatch) {
    // Update score if different
    if (existingMatch.score !== score) {
      return await prisma.match.update({
        where: { id: existingMatch.id },
        data: { score }
      });
    }
    return existingMatch;
  }

  const match = await prisma.match.create({
    data: {
      studentId,
      offerId,
      score
    }
  });

  return match;
};

const getMatchesForStudent = async (studentId) => {
  const matches = await prisma.match.findMany({
    where: { studentId },
    include: {
      offer: {
        include: {
          company: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      }
    },
    orderBy: {
      score: 'desc'
    }
  });

  return matches;
};

const getMatchesForOffer = async (offerId) => {
  const matches = await prisma.match.findMany({
    where: { offerId },
    include: {
      student: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }
    },
    orderBy: {
      score: 'desc'
    }
  });

  return matches;
};

const calculateMatchScore = async (studentId, offerId) => {
  // Simple matching logic - in real app, this would be more sophisticated
  const student = await prisma.student.findUnique({
    where: { userId: studentId },
    select: { skills: true }
  });

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { description: true, category: true }
  });

  if (!student || !offer) {
    throw new Error('Student or offer not found');
  }

  // Simple keyword matching
  const studentSkills = student.skills.map(skill => skill.toLowerCase());
  const offerText = (offer.description + ' ' + (offer.category || '')).toLowerCase();

  let score = 0;
  studentSkills.forEach(skill => {
    if (offerText.includes(skill)) {
      score += 20; // 20 points per matching skill
    }
  });

  // Cap at 100
  score = Math.min(score, 100);

  return score;
};

module.exports = {
  createMatch,
  getMatchesForStudent,
  getMatchesForOffer,
  calculateMatchScore
};