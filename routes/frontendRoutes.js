const express = require("express");
const router = express.Router();
const {
  getAllRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/frontendController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/records", authenticateToken, getAllRecords);
router.patch("/update/:id", updateRecord);
router.delete("/delete/:id", deleteRecord);

module.exports = router;
