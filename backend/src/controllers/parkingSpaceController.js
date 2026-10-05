const ParkingSpace = require("../models/ParkingSpace");

// GET all parking spaces
const getParkingSpaces = async (req, res) => {
  try {
    const spaces = await ParkingSpace.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Parking spaces retrieved successfully",
      data: spaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve parking spaces",
      error: error.message
    });
  }
};

// GET one parking space
const getParkingSpaceById = async (req, res) => {
  try {
    const space = await ParkingSpace.findById(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Parking space not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking space retrieved successfully",
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve parking space",
      error: error.message
    });
  }
};

// CREATE parking space
const createParkingSpace = async (req, res) => {
  try {
    const { spaceNumber, location, status } = req.body;

    if (!spaceNumber || !location) {
      return res.status(400).json({
        success: false,
        message: "spaceNumber and location are required"
      });
    }

    const existingSpace = await ParkingSpace.findOne({
      spaceNumber: spaceNumber.toUpperCase()
    });

    if (existingSpace) {
      return res.status(409).json({
        success: false,
        message: "A parking space with this number already exists"
      });
    }

    const space = await ParkingSpace.create({
      spaceNumber,
      location,
      status
    });

    res.status(201).json({
      success: true,
      message: "Parking space created successfully",
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create parking space",
      error: error.message
    });
  }
};

// UPDATE parking space
const updateParkingSpace = async (req, res) => {
  try {
    const space = await ParkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Parking space not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking space updated successfully",
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update parking space",
      error: error.message
    });
  }
};

// DELETE parking space
const deleteParkingSpace = async (req, res) => {
  try {
    const space = await ParkingSpace.findByIdAndDelete(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Parking space not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking space deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete parking space",
      error: error.message
    });
  }
};

module.exports = {
  getParkingSpaces,
  getParkingSpaceById,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace
};