const Payment = require("../models/Payment");
const ParkingSession = require("../models/ParkingSession");

// GET all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "parkingSession",
        populate: [
          { path: "vehicle" },
          { path: "parkingSpace" }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
      error: error.message
    });
  }
};

// GET one payment
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: "parkingSession",
      populate: [
        { path: "vehicle" },
        { path: "parkingSpace" }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment retrieved successfully",
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment",
      error: error.message
    });
  }
};

// CREATE payment
const createPayment = async (req, res) => {
  try {
    const {
      parkingSession,
      amount,
      paymentMethod,
      transactionReference
    } = req.body;

    if (!parkingSession || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "parkingSession, amount and paymentMethod are required"
      });
    }

    const sessionExists = await ParkingSession.findById(parkingSession);

    if (!sessionExists) {
      return res.status(404).json({
        success: false,
        message: "Parking session not found"
      });
    }

    const payment = await Payment.create({
      parkingSession,
      amount,
      paymentMethod,
      transactionReference
    });

    const populatedPayment = await Payment.findById(payment._id).populate({
      path: "parkingSession",
      populate: [
        { path: "vehicle" },
        { path: "parkingSpace" }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: populatedPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment
};