const { Schema, model } = require("mongoose");

const Ids = new Schema({
  ids: [{ type: String, ref: "Id" }],
});

module.exports = model("Ids", Ids);
