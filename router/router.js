const controller = require("../controllers/controller");
const express = require("express");
const router = express.Router();


router.post("/", controller)

module.exports = router;