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
    orderBy: {
      score: 'desc'
    }
  });

  if (matches.length === 0) return [];

  const offerIds = [...new Set(matches.map(match => match.offerId))];
  const offers = await prisma.offer.findMany({
    where: { id: { in: offerIds } },
    include: {
      company: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    }
  });
  const offersById = new Map(offers.map(offer => [offer.id, offer]));

  return matches
    .map(match => {
      const offer = offersById.get(match.offerId);
      if (!offer) return null;
      return {
        ...match,
        offer
      };
    })
    .filter(Boolean);
};

const getMatchesForOffer = async (offerId) => {
  const matches = await prisma.match.findMany({
    where: { offerId },
    orderBy: {
      score: 'desc'
    }
  });

  if (matches.length === 0) return [];

  const studentIds = [...new Set(matches.map(match => match.studentId))];
  const students = await prisma.student.findMany({
    where: { id: { in: studentIds } },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });
  const studentsById = new Map(students.map(student => [student.id, student]));

  return matches
    .map(match => {
      const student = studentsById.get(match.studentId);
      if (!student) return null;
      return {
        ...match,
        student
      };
    })
    .filter(Boolean);
};

const calculateMatchScore = async (studentId, offerId) => {
  // Simple matching logic - in real app, this would be more sophisticated
  const student = await prisma.student.findUnique({
    where: { id: studentId },
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

const recalculateMatchesForStudent = async (studentId) => {
  const offers = await prisma.offer.findMany({
    select: { id: true }
  });

  await Promise.allSettled(
    offers.map(async (offer) => {
      const score = await calculateMatchScore(studentId, offer.id);
      await createMatch(studentId, offer.id, score);
    })
  );
};

const recalculateMatchesForOffer = async (offerId) => {
  const students = await prisma.student.findMany({
    select: { id: true }
  });

  await Promise.allSettled(
    students.map(async (student) => {
      const score = await calculateMatchScore(student.id, offerId);
      await createMatch(student.id, offerId, score);
    })
  );
};

module.exports = {
  createMatch,
  getMatchesForStudent,
  getMatchesForOffer,
  calculateMatchScore,
  recalculateMatchesForStudent,
  recalculateMatchesForOffer
};