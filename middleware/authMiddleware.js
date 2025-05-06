const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Load User model
const { sendError } = require("../services/responseService"); // ✅ Unified response
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return sendError(res, "Access denied. No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Query MongoDB to fetch full user data
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    req.user = user; // Attach full user object to request

    next();
  } catch (err) {
    return sendError(res, "Invalid token", 403, err.message);
  }
};

module.exports = authenticateToken;
