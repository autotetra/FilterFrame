const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");
const { sendSuccess, sendError } = require("../services/responseService");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, "Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return sendSuccess(
      res,
      "Registration successful. Your account is pending approval.",
      null,
      201
    );
  } catch (err) {
    console.error("Register error:", err);
    return sendError(res, "Server error during registration", 500, err.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return sendError(res, "User not found", 404);
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return sendError(res, "Invalid password", 401);
    }

    // 3. Check role
    const userRole = existingUser.role;

    // 4. Check status (only for normal users)
    if (userRole === "user") {
      if (existingUser.status === "pending") {
        return sendError(res, "Your account is pending approval", 403);
      }
      if (existingUser.status === "declined") {
        return sendError(res, "Your account was not approved", 403);
      }
    }

    // 5. Generate token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 6. Success response
    return sendSuccess(res, "Login successful", {
      token,
      role: userRole,
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, "Server error", 500, err.message);
  }
};

module.exports = { register, login };
