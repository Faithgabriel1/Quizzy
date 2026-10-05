const express = require("express");

const {
  getParkingSpaces,
  getParkingSpaceById,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace
} = require("../controllers/parkingSpaceController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parking Spaces
 *   description: Manage parking spaces
 */

/**
 * @swagger
 * /api/parking/spaces:
 *   get:
 *     summary: Get all parking spaces
 *     tags: [Parking Spaces]
 *     responses:
 *       200:
 *         description: Parking spaces retrieved successfully
 */
router.get("/", getParkingSpaces);

/**
 * @swagger
 * /api/parking/spaces:
 *   post:
 *     summary: Create a parking space
 *     tags: [Parking Spaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spaceNumber
 *               - location
 *             properties:
 *               spaceNumber:
 *                 type: string
 *                 example: A-01
 *               location:
 *                 type: string
 *                 example: Ground Floor
 *               status:
 *                 type: string
 *                 example: available
 *     responses:
 *       201:
 *         description: Parking space created successfully
 */
router.post("/", createParkingSpace);

/**
 * @swagger
 * /api/parking/spaces/{id}:
 *   get:
 *     summary: Get parking space by ID
 *     tags: [Parking Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking space retrieved successfully
 *       404:
 *         description: Parking space not found
 */
router.get("/:id", getParkingSpaceById);

/**
 * @swagger
 * /api/parking/spaces/{id}:
 *   put:
 *     summary: Update parking space
 *     tags: [Parking Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking space updated successfully
 */
router.put("/:id", updateParkingSpace);

/**
 * @swagger
 * /api/parking/spaces/{id}:
 *   delete:
 *     summary: Delete parking space
 *     tags: [Parking Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking space deleted successfully
 */
router.delete("/:id", deleteParkingSpace);

module.exports = router;