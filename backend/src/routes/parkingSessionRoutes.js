const express = require("express");

const {
  getParkingSessions,
  getParkingSessionById,
  createParkingSession,
  updateParkingSession
} = require("../controllers/parkingSessionController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parking Sessions
 *   description: Manage vehicle parking sessions
 */

/**
 * @swagger
 * /api/parking/sessions:
 *   get:
 *     summary: Get all parking sessions
 *     tags: [Parking Sessions]
 *     responses:
 *       200:
 *         description: Parking sessions retrieved successfully
 */
router.get("/", getParkingSessions);

/**
 * @swagger
 * /api/parking/sessions:
 *   post:
 *     summary: Start a parking session
 *     tags: [Parking Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle
 *               - parkingSpace
 *             properties:
 *               vehicle:
 *                 type: string
 *                 example: 6ac3da3fe309b2c408752fb7
 *               parkingSpace:
 *                 type: string
 *                 example: 65abc123456789abcdef123
 *     responses:
 *       201:
 *         description: Parking session created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Vehicle or parking space not found
 */
router.post("/", createParkingSession);

/**
 * @swagger
 * /api/parking/sessions/{id}:
 *   get:
 *     summary: Get parking session by ID
 *     tags: [Parking Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking session retrieved successfully
 *       404:
 *         description: Parking session not found
 */
router.get("/:id", getParkingSessionById);

/**
 * @swagger
 * /api/parking/sessions/{id}:
 *   put:
 *     summary: Complete a parking session
 *     tags: [Parking Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking session completed successfully
 *       404:
 *         description: Parking session not found
 */
router.put("/:id", updateParkingSession);

module.exports = router;