const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDatabase } = require('./config/database');

// Routes
const authRoutes          = require('./routes/authRoutes');
const studentRoutes       = require('./routes/studentRoutes');
const companyRoutes       = require('./routes/companyRoutes');
const offerRoutes         = require('./routes/offerRoutes');
const applicationRoutes   = require('./routes/applicationRoutes');
const matchRoutes         = require('./routes/matchRoutes');
const chatRoutes          = require('./routes/chatRoutes');
const notificationRoutes  = require('./routes/notificationRoutes');
const adminRoutes         = require('./routes/adminRoutes');
const aiRoutes          = require("./routes/aiRoutes");

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ─── Security Middleware ─────────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ─── Rate Limiting ───────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use(globalLimiter);

// ─── Body Parsing ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to InternBeacon API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'InternBeacon API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',          authLimiter, authRoutes);
app.use('/api/students',      studentRoutes);
app.use('/api/companies',     companyRoutes);
app.use('/api/offers',        offerRoutes);
app.use('/api/applications',  applicationRoutes);
app.use('/api/matches',       matchRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);
app.use("/api/ai",          aiRoutes);

// ─── Error Handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 InternBeacon API Server`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
  });
};

startServer();

module.exports = app;