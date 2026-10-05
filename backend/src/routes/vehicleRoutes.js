const express = require("express");

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Manage vehicles
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getVehicles);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Register a vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - vehicleType
 *               - ownerName
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 example: ABC-123-XY
 *               vehicleType:
 *                 type: string
 *                 example: car
 *               ownerName:
 *                 type: string
 *                 example: Patrick Ejim
 *               phoneNumber:
 *                 type: string
 *                 example: 08012345678
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Vehicle already exists
 */
router.post("/", createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       404:
 *         description: Vehicle not found
 */
router.get("/:id", getVehicleById);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plateNumber:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 */
router.put("/:id", updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */
router.delete("/:id", deleteVehicle);

module.exports = router;