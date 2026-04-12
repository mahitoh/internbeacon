const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getAll, markRead } = require('../controllers/notificationController');

const router = express.Router();

// All routes require auth
router.use(authenticateToken);

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get user notifications
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/:id/read', markRead);

module.exports = router;