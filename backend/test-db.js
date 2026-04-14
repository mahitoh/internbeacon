require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const { PrismaClient } = require('@prisma/client');
console.log('Creating PrismaClient...');

try {
  const prisma = new PrismaClient();
  console.log('PrismaClient created successfully');
} catch (error) {
  console.error('Error creating PrismaClient:', error.message);
}
