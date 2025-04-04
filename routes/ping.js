const express = require("express");
const router = express.Router();
const {
  getPing,
  createPing,
  getPingById,
  deletePing,
} = require("../controllers/pingController");

router.get("/ping", getPing);

router.get("/ping/:id", getPingById);

router.post("/ping", createPing);

router.delete("/ping/:id", deletePing);

module.exports = router;
