const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // req.user comes from the token
    if (!user || user.role !== "admin") {
      return res.status(500).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { isAdmin };
