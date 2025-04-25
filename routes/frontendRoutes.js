const express = require("express");
const router = express.Router();
const { getAllRecords } = require("../controllers/frontendController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/records", authenticateToken, getAllRecords);

module.exports = router;
