const { Schema, model } = require("mongoose");

const Goods = new Schema({
  goods: [{ type: Object, ref: "Good" }],
});

module.exports = model("Goods", Goods);
