const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "Registration successful. Your account is pending approval.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error during registration",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }

    // 3. Check role
    const userRole = existingUser.role;

    // 4. Check status (only for normal users)
    if (userRole === "user") {
      if (existingUser.status === "pending") {
        return res.status(403).json({
          status: "error",
          message: "Your account is pending approval",
        });
      }
      if (existingUser.status === "declined") {
        return res.status(403).json({
          status: "error",
          message: "Your account was not approved",
        });
      }
    }

    // 5. Generate token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 6. Success response
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        role: userRole,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { register, login };
