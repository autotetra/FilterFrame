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
    // 1. Find the user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // 2.5 Check user status
    if (existingUser.status === "pending") {
      return res.status(403).json({
        status: "error",
        message: "Your account is pending approval.",
      });
    }

    // 3. Check if the account was declined
    if (existingUser.status === "declined") {
      return res.status(403).json({
        status: "error",
        message: "Your account was not approved.",
      });
    }

    // 4. Generate JWT
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Return success response with token
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { token },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" }).select(
      "-password"
    );
    res.status(200).json({
      status: "success",
      message: "Pending users fetched successfully",
      data: pendingUsers,
    });
  } catch (err) {
    console.error("Fetch pending users error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching pending users",
      error: err.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "declined"

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    user.status = status;
    await user.save();

    if (user.status === "approved") {
      await sendEmail({
        to: user.email,
        subject: "Your account has been approved 🎉",
        loginLink: "https://www.google.com",
      });
    }

    res.status(200).json({
      status: "success",
      message: `User status updated to ${status}`,
      data: { userId: user._id, email: user.email, status: user.status },
    });
  } catch (err) {
    console.error("Update user status error:", err);
    res.status(500).json({
      status: "error",
      message: "Error updating user status",
      error: err.message,
    });
  }
};

module.exports = { register, login, getPendingUsers, updateUserStatus };
