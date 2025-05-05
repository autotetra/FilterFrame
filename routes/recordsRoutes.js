const express = require("express");
const router = express.Router();
const {
  getAllRecords,
  updateRecord,
  deleteRecord,
  createRecord,
} = require("../controllers/recordController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, getAllRecords);
router.patch("/update/:id", authenticateToken, updateRecord);
router.delete("/delete/:id", deleteRecord);
router.post("/create", authenticateToken, createRecord);

module.exports = router;
