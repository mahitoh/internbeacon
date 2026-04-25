const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

const register = async (data) => {
  const { email, password, name, role } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'STUDENT',
    },
  });

  if (user.role === 'STUDENT') {
    await prisma.student.create({
      data: { userId: user.id, skills: [] },
    });
  } else if (user.role === 'COMPANY') {
    await prisma.company.create({
      data: { userId: user.id },
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    token,
    refreshToken,
  };
};

const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    token,
    refreshToken,
  };
};

const refresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return { token: newToken };
  } catch (_error) {
    throw new Error('Invalid refresh token');
  }
};

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      student: {
        select: {
          id: true,
          avatarUrl: true,
          city: true,
          school: { select: { id: true, name: true, city: true } },
        },
      },
      company: {
        select: {
          id: true,
          industry: true,
          city: true,
          logoUrl: true,
          coverImageUrl: true,
        },
      },
    },
  });

  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { register, login, refresh, getCurrentUser };
