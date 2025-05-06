const User = require("../models/User");
const { sendError } = require("../services/responseService"); // ✅ unified response

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // req.user comes from the token
    if (!user || user.role !== "admin") {
      return sendError(res, "Access denied. Admins only.", 403);
    }
    next();
  } catch (err) {
    console.error(err);
    return sendError(res, "Server error", 500, err.message);
  }
};

module.exports = { isAdmin };
