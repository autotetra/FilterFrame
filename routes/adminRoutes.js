const { isAdmin } = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  updateUserStatus,
  getUsers,
} = require("../controllers/adminController");

router.patch("/users/:id/status", authenticateToken, isAdmin, updateUserStatus);

router.get("/users", authenticateToken, isAdmin, getUsers);

module.exports = router;
