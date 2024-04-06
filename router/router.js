const Controller = require("../controllers/controller");
const authMiddleware = require("../middleware/authMiddleware");
const imitationError = require("../middleware/imitationErrorMiddleware");
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, imitationError, async (req, res) => {
  new Controller(req, res);
});

module.exports = router;
