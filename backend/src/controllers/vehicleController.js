const Vehicle = require("../models/Vehicle");

// GET all vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles",
      error: error.message
    });
  }
};

// GET one vehicle
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicle",
      error: error.message
    });
  }
};

// CREATE vehicle
const createVehicle = async (req, res) => {
  try {
    const { plateNumber, vehicleType, ownerName, phoneNumber } = req.body;

    if (!plateNumber || !vehicleType || !ownerName) {
      return res.status(400).json({
        success: false,
        message: "plateNumber, vehicleType and ownerName are required"
      });
    }

    const existingVehicle = await Vehicle.findOne({
      plateNumber: plateNumber.toUpperCase()
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "A vehicle with this plate number already exists"
      });
    }

    const vehicle = await Vehicle.create({
      plateNumber,
      vehicleType,
      ownerName,
      phoneNumber
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: error.message
    });
  }
};

// UPDATE vehicle
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message
    });
  }
};

// DELETE vehicle
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: error.message
    });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};