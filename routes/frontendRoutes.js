const express = require("express");
const router = express.Router();
const {
  getAllRecords,
  updateRecord,
} = require("../controllers/frontendController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/records", authenticateToken, getAllRecords);
router.patch("/update/:id", updateRecord);

module.exports = router;
