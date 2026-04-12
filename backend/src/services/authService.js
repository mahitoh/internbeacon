const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

const register = async (data) => {
  const { email, password, name, role } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'STUDENT',
    },
  });

  // Create profile based on role
  if (user.role === 'STUDENT') {
    await prisma.student.create({
      data: { userId: user.id, skills: [] },
    });
  } else if (user.role === 'COMPANY') {
    await prisma.company.create({
      data: { userId: user.id },
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
};

const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
};

module.exports = { register, login };