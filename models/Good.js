const { Schema, model } = require("mongoose");

const Good = new Schema({
  Id: { type: String },
  brand: { type: String },
  price: { type: Number },
  product: { type: String },
});

module.exports = model("Good", Good);
