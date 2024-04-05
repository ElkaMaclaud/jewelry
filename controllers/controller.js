const path = require("path");
const Id = require("../models/Id");
const Good = require("../models/Good");

class Controller {
  req;
  body = {};
  action = "";
  params = {};

  constructor(req) {
    this.req = req;
    this.action = req.body.action || "";
    this.params = req.body.params || {};
  }

  async getIds(req, res) {
    try {
      const offset = parseInt(this.params.offset) || 0;
      const limit = parseInt(this.params.limit) || 50;
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
      const offset = parseInt(this.params.offset) || 0;
      const limit = parseInt(this.params.limit) || 50;
      const key = Object.keys(this.params).find(
        (key) => key !== "offset" && key !== "limit"
      );
      const searchKey =
        key === "product"
          ? { [key]: { $regex: this.params[key], $options: "i" } }
          : { [key]: this.params[key] };
          
      const idsSelected = await Good.aggregate([
        { $match: searchKey },
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
