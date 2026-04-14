const express = require('express');
const winston = require('winston');
const NodeCache = require('node-cache');
const { Server } = require('socket.io');
const http = require('http');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDatabase } = require('./src/config/database');

// Routes
const authRoutes          = require('./src/routes/authRoutes');
const studentRoutes       = require('./src/routes/studentRoutes');
const companyRoutes       = require('./src/routes/companyRoutes');
const offerRoutes         = require('./src/routes/offerRoutes');
const applicationRoutes   = require('./src/routes/applicationRoutes');
const matchRoutes         = require('./src/routes/matchRoutes');
const chatRoutes          = require('./src/routes/chatRoutes');
const notificationRoutes  = require('./src/routes/notificationRoutes');
const adminRoutes         = require('./src/routes/adminRoutes');
const aiRoutes            = require('./src/routes/aiRoutes');
const progressRoutes      = require('./src/routes/progressRoutes');

const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), new winston.transports.File({ filename: 'logs/combined.log' })],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// Cache setup
const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

global.logger = logger;
global.cache = cache;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

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

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InternBeacon API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for endpoint testing',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
  },
  apis: ['./src/docs/swagger.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── API Routes (v1) ──────────────────────────────────────────────
app.use('/api/v1/auth',          authLimiter, authRoutes);
app.use('/api/v1/students',      studentRoutes);
app.use('/api/v1/companies',     companyRoutes);
app.use('/api/v1/offers',        offerRoutes);
app.use('/api/v1/applications',  applicationRoutes);
app.use('/api/v1/matches',       matchRoutes);
app.use('/api/v1/chat',          chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin',         adminRoutes);
app.use("/api/v1/ai",          aiRoutes);
app.use('/api/v1/progress',      progressRoutes);

// ─── Error Handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// WebSocket setup
io.on('connection', (socket) => {
  logger.info('User connected: ' + socket.id);
  socket.on('disconnect', () => logger.info('User disconnected: ' + socket.id));
});
global.io = io;

const startServer = async () => {
  await connectDatabase();
  server.listen(PORT, () => {
    logger.info(`🚀 InternBeacon API Server started`);
    logger.info(`📍 Port: ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 Health: http://localhost:${PORT}/health`);
    logger.info(`📖 API Docs: http://localhost:${PORT}/api-docs`);
  });
};

startServer();

module.exports = app;