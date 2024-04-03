const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const router = require("./router/router");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fetchGoodsAndSaveToMongoDB = require("./controllers/getDataController");
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(express.json());
// app.use("/", router);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASSWORD}@cluster0.sytqp8w.mongodb.net/jewelry`
    );
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
