const mongoose = require("mongoose");

const parkingSpaceSchema = new mongoose.Schema(
  {
    spaceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ParkingSpace", parkingSpaceSchema);