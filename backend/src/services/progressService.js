const { prisma } = require('../config/database');

const calculateProfileCompletion = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  const profile = {
    hasName: !!student.user.name,
    hasEmail: !!student.user.email,
    hasBio: !!student.bio,
    hasSkills: student.skills && student.skills.length > 0,
    hasProfileStrength: student.profileStrength > 0,
    skillsCount: student.skills ? student.skills.length : 0,
    bioLength: student.bio ? student.bio.length : 0
  };

  // Calculate completion percentage
  const requiredFields = ['hasName', 'hasEmail', 'hasBio', 'hasSkills'];
  const completedFields = requiredFields.filter(field => profile[field]).length;

  let percentage = (completedFields / requiredFields.length) * 100;

  // Bonus points for additional info
  if (profile.skillsCount >= 3) percentage += 10;
  if (profile.bioLength >= 100) percentage += 10;
  if (profile.hasProfileStrength) percentage += 5;

  percentage = Math.min(percentage, 100);

  // Update profile strength in database
  await prisma.student.update({
    where: { id: studentId },
    data: { profileStrength: Math.round(percentage) }
  });

  return {
    percentage: Math.round(percentage),
    completedFields,
    totalFields: requiredFields.length,
    profile,
    suggestions: getCompletionSuggestions(profile)
  };
};

const getCompletionSuggestions = (profile) => {
  const suggestions = [];

  if (!profile.hasBio) {
    suggestions.push('Add a professional bio to introduce yourself to employers');
  } else if (profile.bioLength < 50) {
    suggestions.push('Expand your bio to provide more details about your background');
  }

  if (!profile.hasSkills || profile.skillsCount < 3) {
    suggestions.push('Add at least 3 relevant skills to improve matching');
  }

  if (profile.skillsCount >= 3 && profile.skillsCount < 5) {
    suggestions.push('Consider adding more skills to stand out');
  }

  return suggestions;
};

const getApplicationStats = async (studentId) => {
  const applications = await prisma.application.findMany({
    where: { studentId },
    include: {
      offer: {
        include: {
          company: {
            include: { user: true }
          }
        }
      }
    }
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    shortlisted: applications.filter(app => app.status === 'SHORTLISTED').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    responseRate: 0,
    avgResponseTime: 0
  };

  // Calculate response rate
  const responded = stats.shortlisted + stats.accepted + stats.rejected;
  stats.responseRate = stats.total > 0 ? Math.round((responded / stats.total) * 100) : 0;

  // Calculate average response time (simplified)
  if (responded > 0) {
    const responseTimes = applications
      .filter(app => app.status !== 'PENDING')
      .map(app => {
        const appliedDate = new Date(app.createdAt);
        const updatedDate = new Date(app.updatedAt);
        return Math.max(0, updatedDate - appliedDate); // in milliseconds
      });

    if (responseTimes.length > 0) {
      const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      stats.avgResponseTime = Math.round(avgMs / (1000 * 60 * 60 * 24)); // days
    }
  }

  return stats;
};

const getOverallProgress = async (studentId) => {
  const profileProgress = await calculateProfileCompletion(studentId);
  const applicationStats = await getApplicationStats(studentId);

  // Calculate overall progress score
  let overallScore = profileProgress.percentage * 0.4; // 40% weight on profile

  // Application activity (30% weight)
  if (applicationStats.total >= 5) overallScore += 30;
  else if (applicationStats.total >= 3) overallScore += 20;
  else if (applicationStats.total >= 1) overallScore += 10;

  // Quality applications (30% weight)
  const qualityScore = (applicationStats.shortlisted + applicationStats.accepted) / Math.max(applicationStats.total, 1) * 30;
  overallScore += qualityScore;

  overallScore = Math.min(overallScore, 100);

  return {
    overallScore: Math.round(overallScore),
    profileProgress,
    applicationStats,
    nextMilestones: getNextMilestones(profileProgress, applicationStats)
  };
};

const getNextMilestones = (profile, apps) => {
  const milestones = [];

  if (profile.percentage < 80) {
    milestones.push('Complete your profile to 80% for better visibility');
  }

  if (apps.total < 3) {
    milestones.push('Apply to 3 internships to get started');
  }

  if (apps.total >= 3 && apps.responseRate < 30) {
    milestones.push('Improve response rate by tailoring applications');
  }

  if (apps.accepted === 0 && apps.total >= 5) {
    milestones.push('Consider revising your approach or seeking feedback');
  }

  return milestones;
};

module.exports = {
  calculateProfileCompletion,
  getApplicationStats,
  getOverallProgress
};