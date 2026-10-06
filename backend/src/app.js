const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const parkingSpaceRoutes = require("./routes/parkingSpaceRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const parkingSessionRoutes = require("./routes/parkingSessionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const { verifyToken, requireAdminFor } = require("./middleware/auth");

dotenv.config();

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Connect database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

//API routes
// Login and register are open to everyone.
app.use("/api/auth", authRoutes);

// Everything below needs a logged-in user. Some actions are admin only.
app.use("/api/parking/spaces", verifyToken, requireAdminFor(["POST", "PUT", "DELETE"]), parkingSpaceRoutes);
app.use("/api/vehicles", verifyToken, requireAdminFor(["PUT", "DELETE"]), vehicleRoutes);
app.use("/api/parking/sessions", verifyToken, requireAdminFor(["GET"], true), parkingSessionRoutes);
app.use("/api/payments", verifyToken, paymentRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Parking Management System API is running"
    });
});

module.exports = app;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Parking Management API running on http://localhost:${PORT}`);
});
