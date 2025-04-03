const express = require("express");
const router = express.Router();
const {
  getPing,
  createPing,
  getPingById,
} = require("../controllers/pingController");

router.get("/ping", getPing);

router.get("/ping/:id", getPingById);

router.post("/ping", createPing);

module.exports = router;
