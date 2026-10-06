const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "1d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // The email set as ADMIN_EMAIL in backend/.env becomes the admin account.
    const isAdmin =
      process.env.ADMIN_EMAIL &&
      cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim();

    const newUser = await User.create({
      username,
      email: cleanEmail,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user"
    });

    res.status(201).json({ token: makeToken(newUser), user: publicUser(newUser) });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};
