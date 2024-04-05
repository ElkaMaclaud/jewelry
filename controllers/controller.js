const path = require("path");
const md5 = require("md5");
const Id = require("../models/Id");
const Good = require("../models/Good");

class Controller {
  req;
  body = {};
  action = "";
  params = {};

  constructor(req) {
    this.xAuthTimestamp = req.header("X-Auth");
    this.timestamp = md5(
      `${process.env.SERVER_KEY}_${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}`
    );
    this.req = req;
    this.action = req.body.action || "";
    this.params = req.body.params || {};
    this.getCheckSecretStamp();
  }
  async getCheckSecretStamp(req, res) {
    if (this.timestamp !== this.timestamp) {
      res.status(403).json({ success: false, message: "Нет доступа" });
    }
  }
  async getIds(req, res) {
    try {
      this.getCheckSecretStamp();
      const offset = parseInt(this.params.offset) || 0;
      const limit = parseInt(this.params.limit) || 50;
      //const ids = await Id.distinct("id")
      const idsArray = await Id.aggregate([
        { $group: { _id: null, ids: { $push: "$id" } } },
        { $project: { _id: 0, ids: 1 } },
        { $skip: offset },
        { $limit: limit },
      ]);

      const ids = idsArray[0].ids;
      res.json({
        success: true,
        result: ids,
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
      this.getCheckSecretStamp();
      const offset = parseInt(this.params.offset) || 0;
      const limit = parseInt(this.params.limit) || 50;
      const key = Object.keys(this.params).find(
        (key) => key !== "offset" && key !== "limit"
      );
      const idsSelected = await Good.aggregate([
        { $match: { [key]: this.params[key] } },
        { $group: { _id: null, ids: { $push: "$id" } } },
        { $project: { _id: 0, ids: 1 } },
        { $skip: offset },
        { $limit: limit },
      ]);
      const ids = idsSelected.length > 0 ? idsSelected[0].ids : [];
      res.json({
        success: true,
        result: ids,
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
      this.getCheckSecretStamp();
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 50;
      const fieldsArray = await Good.aggregate([
        { $group: { _id: null, fields: { $push: `$${this.params.field}` } } },
        { $project: { _id: 0, fields: 1 } },
        { $skip: offset },
        { $limit: limit },
      ]);
      const fields = fieldsArray[0].fields;
      res.json({
        success: true,
        result: fields,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
  async getItems(req, res) {
    try {
      this.getCheckSecretStamp();
      const limit = parseInt(req.query.limit) || 100;
      const goods = await Good.find({ id: { $in: this.params.ids } }).limit(
        limit
      );
      res.json({
        success: true,
        result: goods,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
}

module.exports = Controller;
