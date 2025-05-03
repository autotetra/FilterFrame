const express = require("express");
const router = express.Router();
const {
  getAllRecords,
  updateRecord,
  deleteRecord,
  createRecord,
} = require("../controllers/frontendController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/records", authenticateToken, getAllRecords);
router.patch("/update/:id", updateRecord);
router.delete("/delete/:id", deleteRecord);
router.post("/create", authenticateToken, createRecord);

module.exports = router;
