const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailSender");
require("dotenv").config();

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

module.exports = { getPendingUsers, updateUserStatus };
