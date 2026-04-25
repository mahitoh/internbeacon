const { prisma } = require('../config/database');
const { saveImageBuffer } = require('./mediaService');

const uploadStudentAvatar = async (userId, file) => {
  if (!file) throw new Error('Image file is required');

  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error('Student not found');

  const saved = await saveImageBuffer({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    folder: 'students',
  });

  const updated = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { avatarUrl: saved.publicPath },
    });

    return tx.student.update({
      where: { userId },
      data: { avatarUrl: saved.publicPath },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });
  });

  return { ...updated, uploaded: saved };
};

const uploadCompanyLogo = async (userId, file) => {
  if (!file) throw new Error('Image file is required');

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Company not found');

  const saved = await saveImageBuffer({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    folder: 'companies/logos',
  });

  const updated = await prisma.company.update({
    where: { userId },
    data: { logoUrl: saved.publicPath },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  });

  return { ...updated, uploaded: saved };
};

const uploadCompanyCover = async (userId, file) => {
  if (!file) throw new Error('Image file is required');

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) throw new Error('Company not found');

  const saved = await saveImageBuffer({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    folder: 'companies/covers',
  });

  const updated = await prisma.company.update({
    where: { userId },
    data: { coverImageUrl: saved.publicPath },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  });

  return { ...updated, uploaded: saved };
};

module.exports = {
  uploadStudentAvatar,
  uploadCompanyLogo,
  uploadCompanyCover,
};
