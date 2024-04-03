const { Schema, model } = require("mongoose");

const Good = new Schema({
  id: { type: String, require: true },
  brand: { type: String },
  price: { type: Number, require: true },
  product: { type: String, require: true },
});

module.exports = model("Good", Good);
