const { Schema, model } = require("mongoose");

const Good = new Schema({
  Id: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  product: { type: String, required: true },
});

module.exports = model("Good", Good);
