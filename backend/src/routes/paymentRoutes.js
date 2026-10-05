const express = require("express");

const {
  getPayments,
  getPaymentById,
  createPayment
} = require("../controllers/paymentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manage parking payments
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 */
router.get("/", getPayments);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Record a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parkingSession
 *               - amount
 *               - paymentMethod
 *             properties:
 *               parkingSession:
 *                 type: string
 *                 example: 65abc123456789abcdef123
 *               amount:
 *                 type: number
 *                 example: 500
 *               paymentMethod:
 *                 type: string
 *                 example: cash
 *               transactionReference:
 *                 type: string
 *                 example: TXN-001
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
router.post("/", createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         description: Payment not found
 */
router.get("/:id", getPaymentById);

module.exports = router;