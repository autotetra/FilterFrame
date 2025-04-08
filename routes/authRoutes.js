const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();
const athneticationToken = require("../controllers/authMiddleware");
const authenticateToken = require("../controllers/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/protected", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.user });
});

module.exports = router;
