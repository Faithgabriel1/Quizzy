const ParkingSession = require("../models/ParkingSession");
const Vehicle = require("../models/Vehicle");
const ParkingSpace = require("../models/ParkingSpace");

// GET all parking sessions
const getParkingSessions = async (req, res) => {
  try {
    const sessions = await ParkingSession.find()
      .populate("vehicle")
      .populate("parkingSpace")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Parking sessions retrieved successfully",
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve parking sessions",
      error: error.message
    });
  }
};

// GET one parking session
const getParkingSessionById = async (req, res) => {
  try {
    const session = await ParkingSession.findById(req.params.id)
      .populate("vehicle")
      .populate("parkingSpace");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Parking session not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking session retrieved successfully",
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve parking session",
      error: error.message
    });
  }
};

// CREATE parking session
const createParkingSession = async (req, res) => {
  try {
    const { vehicle, parkingSpace } = req.body;

    if (!vehicle || !parkingSpace) {
      return res.status(400).json({
        success: false,
        message: "vehicle and parkingSpace are required"
      });
    }

    const vehicleExists = await Vehicle.findById(vehicle);

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    const spaceExists = await ParkingSpace.findById(parkingSpace);

    if (!spaceExists) {
      return res.status(404).json({
        success: false,
        message: "Parking space not found"
      });
    }

    if (spaceExists.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Parking space is not available"
      });
    }

    const existingSession = await ParkingSession.findOne({
      vehicle,
      status: "active"
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "Vehicle already has an active parking session"
      });
    }

    const session = await ParkingSession.create({
      vehicle,
      parkingSpace
    });

    await ParkingSpace.findByIdAndUpdate(parkingSpace, {
      status: "occupied"
    });

    const populatedSession = await ParkingSession.findById(session._id)
      .populate("vehicle")
      .populate("parkingSpace");

    res.status(201).json({
      success: true,
      message: "Parking session created successfully",
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create parking session",
      error: error.message
    });
  }
};

// UPDATE parking session / record exit
const updateParkingSession = async (req, res) => {
  try {
    const session = await ParkingSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Parking session not found"
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Parking session is already completed"
      });
    }

    session.exitTime = new Date();
    session.status = "completed";

    // Simple demo pricing: ₦500 per hour
    const durationInHours =
      (session.exitTime - session.entryTime) / (1000 * 60 * 60);

    const hours = Math.max(1, Math.ceil(durationInHours));

    session.amount = hours * 500;

    await session.save();

    await ParkingSpace.findByIdAndUpdate(session.parkingSpace, {
      status: "available"
    });

    const populatedSession = await ParkingSession.findById(session._id)
      .populate("vehicle")
      .populate("parkingSpace");

    res.status(200).json({
      success: true,
      message: "Parking session completed successfully",
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update parking session",
      error: error.message
    });
  }
};

module.exports = {
  getParkingSessions,
  getParkingSessionById,
  createParkingSession,
  updateParkingSession
};