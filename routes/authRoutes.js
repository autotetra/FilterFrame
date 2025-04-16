const { isAdmin } = require("../middleware/adminMiddleware");
const express = require("express");
const {
  register,
  login,
  getPendingUsers,
  updateUserStatus,
} = require("../controllers/authController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);

router.get("/protected", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.user });
});

router.get("/pending-users", authenticateToken, isAdmin, getPendingUsers);

router.patch("/users/:id/status", authenticateToken, isAdmin, updateUserStatus);

module.exports = router;
