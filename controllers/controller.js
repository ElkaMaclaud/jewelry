const Ids = require("../models/Ids");
const Goods = require("../models/Goods");
const path = require("path");
const fs = require("fs");

class controller {
  async getIds(req, res) {
    try {
      const xAuthTimestamp = req.header("X-Auth");
      const timestamp = md5(
        `${process.env.SERVER_KEY}_${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}`
      );
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 50;
      const ids = await Ids.find().skip(offset).limit(limit);

      res.json({
        success: true,
        resule: ids,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
  async getFilterIds(req, res) {
    try {
      const xAuthTimestamp = req.header("X-Auth");
      const timestamp = md5(
        `${process.env.SERVER_KEY}_${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}`
      );
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 50;
      const ids = await Ids.find().skip(offset).limit(limit);

      res.json({
        success: true,
        resule: ids,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
  async getFields(req, res) {
    try {
      const xAuthTimestamp = req.header("X-Auth");
      const timestamp = md5(
        `${process.env.SERVER_KEY}_${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}`
      );
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 50;
      const ids = await Ids.find().skip(offset).limit(limit);

      res.json({
        success: true,
        resule: ids,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
}

module.exports = new controller();
