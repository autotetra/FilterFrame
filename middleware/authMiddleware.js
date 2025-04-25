const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Load User model
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Query MongoDB to fetch full user data
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach full user object to request

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
