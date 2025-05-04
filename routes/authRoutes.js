const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
