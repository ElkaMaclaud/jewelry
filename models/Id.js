const { Schema, model } = require("mongoose");

const Id = new Schema({
  id: { type: String, required: true },
});

module.exports = model("Id", Id);
