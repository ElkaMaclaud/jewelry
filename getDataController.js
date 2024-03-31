const Ids = require("./models/Ids");
const Goods = require("./models/Goods");
const fs = require("fs");
const https = require("https");
const md5 = require("md5");
const dotenv = require("dotenv");
dotenv.config();

const url = "api.valantis.store";
const port = 41000;

// const data = JSON.stringify({
//   action: "get_ids",
//   params: { offset: 0 },
// });

// const getAllIds = async () => {
//   ids = await Ids.find();
//   console.log("Данные успешно получены:", ids[1]);
// };
const getOptions = async (ids) => {
  const data = JSON.stringify({
    action: "get_items",
    params: { ids }, // ids: ids.map((id) => id._id)
  });
  return {
    hostname: url,
    port: port,
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth": md5(
        `${process.env.SERVER_KEY}_${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}`
      ),
      "Content-Length": data.length,
    },
    body: data,
  };
};
const fetchGoodsAndSaveToMongoDB = async () => {
  let parseIds = [];
  while (!parseIds.length) {
    parseIds = await Ids.find();
  }
  let options;
  if (parseIds[0].ids.length) {
    const ids = parseIds[0].ids;
    options = await getOptions(ids);

    const req = https.request(options, async (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", async () => {
        const responseJson = JSON.parse(responseData).result;
        const items = responseJson.filter(
          (elem, index, self) =>
            index === self.findIndex((i) => i.id === elem.id)
        );
        // const set = new Set()
        // responseJson.forEach(elem => {
        //   if(!set.has(elem.id)) {
        //     set.add(elem.id)
        //     items.push(elem)
        //   } 
        // });
         
        const goods = new Goods({goods: items});
        await goods.save();

        console.log(
          "Данные успешно сохранены в MongoDB:",
          responseJson.length, items.length
        );
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(options.body);
    req.end();
  }
};
const fetchIdsAndSaveToMongoDB = async () => {
  const req = https.request(options, async (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", async () => {
      const responseJson = JSON.parse(responseData);
      const uniqueIds = Array.from(new Set(responseJson.result));
      const newIds = new Ids({ ids: uniqueIds });
      await newIds.save();

      console.log(
        "Данные успешно сохранены в MongoDB:",
        responseJson
      );
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
};
module.exports = fetchGoodsAndSaveToMongoDB, fetchIdsAndSaveToMongoDB;
