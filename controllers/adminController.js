const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
const { sendSuccess, sendError } = require("../services/responseService");
require("dotenv").config();

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "declined"

  try {
    const user = await User.findById(id);
    if (!user) {
      return sendError(res, "User not found", 404);
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

    return sendSuccess(res, `User status updated to ${status}`, {
      userId: user._id,
      email: user.email,
      status: user.status,
    });
  } catch (err) {
    console.error("Update user status error:", err);
    return sendError(res, "Error updating user status", 500, err.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    return sendSuccess(res, "Users fetched successfully", users);
  } catch (err) {
    console.error("Fetch users error:", err);
    return sendError(
      res,
      "Server error while fetching users",
      500,
      err.message
    );
  }
};

module.exports = { updateUserStatus, getUsers };
