const { Schema, model } = require("mongoose");

const Ids = new Schema({
  ids: { type: Object, ref: "Id" },
});

module.exports = model("Ids", Ids);
