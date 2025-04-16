const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Registration successful. Your account is pending approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2.5 Chec user status
    if (existingUser.status === "pending") {
      return res
        .status(403)
        .json({ message: "Your account is pending approval." });
    }

    if (existingUser.status === "declined") {
      return res.status(403).json({ mesage: "Your account was not approved." });
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4. Return success response with token
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" }).select(
      "-password"
    );
    res.status(200).json({ users: pendingUsers });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while fetching pending users." });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "declined"
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user status" });
  }
};

module.exports = { register, login, getPendingUsers, updateUserStatus };
