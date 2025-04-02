const express = require("express");
const router = express.Router();
const { getPing, createPing } = require("../controllers/pingController");

router.get("/ping", getPing);

router.post("/ping", createPing);

module.exports = router;
