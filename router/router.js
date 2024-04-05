const Controller = require("../controllers/controller");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
  const ctrl = new Controller(req);
  switch (ctrl.action) {
    case "get_ids":
      ctrl.getIds(req, res);
      break;
    case "filter":
      ctrl.getFilterIds(req, res);
      break;
    case "get_fields":
      ctrl.getFields(req, res);
      break;
    case "get_items":
      ctrl.getItems(req, res);
      break;
    default:
      res.status(400).json({ success: false, message: "Неверное действие" });
  }
});

module.exports = router;
