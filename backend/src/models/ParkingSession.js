const mongoose = require("mongoose");

const parkingSessionSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },

    parkingSpace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpace",
      required: true
    },

    entryTime: {
      type: Date,
      default: Date.now
    },

    exitTime: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    },

    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ParkingSession", parkingSessionSchema);