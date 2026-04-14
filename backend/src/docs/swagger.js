/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ApiSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           nullable: true
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *
 * tags:
 *   - name: Auth
 *   - name: Students
 *   - name: Companies
 *   - name: Offers
 *   - name: Applications
 *   - name: Matches
 *   - name: Chat
 *   - name: Notifications
 *   - name: Admin
 *   - name: AI
 *   - name: Progress
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               role: { type: string, enum: [STUDENT, COMPANY] }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 *
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Success }
 *       401: { description: Unauthorized }
 *
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Success }
 *       401: { description: Unauthorized }
 */

/**
 * @swagger
 * /api/v1/students/profile:
 *   get:
 *     tags: [Students]
 *     summary: Get student profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Students]
 *     summary: Update student profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/students/stats:
 *   get:
 *     tags: [Students]
 *     summary: Get student dashboard stats
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/students/applications:
 *   get:
 *     tags: [Students]
 *     summary: Get student applications
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/students/recommendations:
 *   get:
 *     tags: [Students]
 *     summary: Get student recommendations
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 */

/**
 * @swagger
 * /api/v1/companies/public/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get public company profile
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/companies/profile:
 *   get:
 *     tags: [Companies]
 *     summary: Get company profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   put:
 *     tags: [Companies]
 *     summary: Update company profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/companies/offers:
 *   get:
 *     tags: [Companies]
 *     summary: Get offers created by company
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Companies]
 *     summary: Create a company offer
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201: { description: Created }
 *
 * /api/v1/companies/applicants:
 *   get:
 *     tags: [Companies]
 *     summary: Get applicants for company offers
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 */

/**
 * @swagger
 * /api/v1/offers:
 *   get:
 *     tags: [Offers]
 *     summary: Get all offers
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Offers]
 *     summary: Create an offer
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201: { description: Created }
 *
 * /api/v1/offers/{id}:
 *   get:
 *     tags: [Offers]
 *     summary: Get offer by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *       404: { description: Not found }
 *
 * /api/v1/offers/apply:
 *   post:
 *     tags: [Offers]
 *     summary: Apply to an offer
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [offerId]
 *             properties:
 *               offerId: { type: string }
 *               coverLetter: { type: string }
 *               resume: { type: string }
 *               portfolio: { type: string }
 *               availability: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 *
 * /api/v1/offers/quick-apply:
 *   post:
 *     tags: [Offers]
 *     summary: Quickly apply to an offer
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [offerId]
 *             properties:
 *               offerId: { type: string }
 *               customCoverLetter: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */

/**
 * @swagger
 * /api/v1/applications/status:
 *   put:
 *     tags: [Applications]
 *     summary: Update application status
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, status]
 *             properties:
 *               id: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Success }
 *       400: { description: Bad request }
 */

/**
 * @swagger
 * /api/v1/matches/student:
 *   get:
 *     tags: [Matches]
 *     summary: Get matches for current student
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/matches/offer/{offerId}:
 *   get:
 *     tags: [Matches]
 *     summary: Get matches for an offer
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/matches:
 *   post:
 *     tags: [Matches]
 *     summary: Create or update a match
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, offerId]
 *             properties:
 *               studentId: { type: string }
 *               offerId: { type: string }
 *               score: { type: number }
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/matches/calculate:
 *   post:
 *     tags: [Matches]
 *     summary: Calculate and create a match
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, offerId]
 *             properties:
 *               studentId: { type: string }
 *               offerId: { type: string }
 *     responses:
 *       200: { description: Success }
 */

/**
 * @swagger
 * /api/v1/chat/rooms:
 *   get:
 *     tags: [Chat]
 *     summary: Get current user's chat rooms
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Chat]
 *     summary: Create chat room
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [participants]
 *             properties:
 *               participants:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201: { description: Created }
 *
 * /api/v1/chat/rooms/{roomId}/messages:
 *   get:
 *     tags: [Chat]
 *     summary: Get room messages
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *   post:
 *     tags: [Chat]
 *     summary: Send room message
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201: { description: Created }
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get user notifications
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/notifications/{id}/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 */

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/admin/offers:
 *   get:
 *     tags: [Admin]
 *     summary: Get all offers
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/admin/users/{userId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/admin/offers/{offerId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete offer
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 */

/**
 * @swagger
 * /api/v1/ai/resume-optimize:
 *   post:
 *     tags: [AI]
 *     summary: Optimize resume text using AI
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resumeText]
 *             properties:
 *               resumeText: { type: string }
 *               jobDescription: { type: string }
 *     responses:
 *       200: { description: Success }
 *       400: { description: Bad request }
 */

/**
 * @swagger
 * /api/v1/progress/profile:
 *   get:
 *     tags: [Progress]
 *     summary: Get profile completion progress
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/progress/applications:
 *   get:
 *     tags: [Progress]
 *     summary: Get application progress
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *
 * /api/v1/progress/overall:
 *   get:
 *     tags: [Progress]
 *     summary: Get overall progress dashboard
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 */
