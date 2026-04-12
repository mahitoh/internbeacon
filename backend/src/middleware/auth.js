const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };