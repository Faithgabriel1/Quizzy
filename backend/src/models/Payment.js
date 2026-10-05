const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    parkingSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSession",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid"
    },

    transactionReference: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);