const Controller = require("../controllers/controller");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  new Controller(req, res);
});

module.exports = router;
