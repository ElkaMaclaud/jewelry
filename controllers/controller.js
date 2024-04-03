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
    // const xAuthTimestamp = req.header("X-Auth");
    // const timestamp = md5(
    //   `${process.env.SERVER_KEY}_${new Date()
    //     .toISOString()
    //     .slice(0, 10)
    //     .replace(/-/g, "")}`
    // );
    this.req = req;
    this.action = req.body.action || "";
    this.params = req.body.params || {};
  }
  async getIds(req, res) {
    try {
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
      const ids = await Good.find({ ...this.params }, "id");

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
      const fields = await Good.find({}, `${this.params["field"]}`)
        .skip(offset)
        .limit(limit);

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

