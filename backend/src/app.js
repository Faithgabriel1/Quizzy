const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

const app = express();

//Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Quizzy API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Quizzy server running on http://localhost:${PORT}`);
});