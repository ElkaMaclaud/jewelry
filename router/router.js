const Controller = require("../controllers/controller");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const controller = new Controller(req);
  await controller.handleRequest(req, res);
});

module.exports = router;
