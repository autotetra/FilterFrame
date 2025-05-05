const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailSender");
require("dotenv").config();

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
      users: { userId: user._id, email: user.email, status: user.status },
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

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      users: users,
    });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching users",
      error: err.message,
    });
  }
};

module.exports = { updateUserStatus, getUsers };
