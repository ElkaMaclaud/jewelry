// Этот контроллер предназначен для работы с первичном бэком для копирования из него всех данных в свою БД
// После сохранения всех данных в своей БД этот модуль будет не нужен
// На данном этапе требуется доработка моделей 
// Данные функции нужно будет вызвать поочереди после подключения к MongoDB - это костыль (но нужно будет сделать всего раз)

const Ids = require("../models/Ids");
const Goods = require("../models/Goods");
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
// const options = { 
//   hostname: url,
//     port: port,
//     path: "/",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Auth": md5(
//         `${process.env.SERVER_KEY}_${new Date()
//           .toISOString()
//           .slice(0, 10)
//           .replace(/-/g, "")}`
//       ),
//       "Content-Length": data.length,
//     },
//     body: data,
//   }

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
  // Функция получения всех товаров из первичного бэка и сохранения данных в свою БД
  let parseIds = [];
  while (!parseIds.length) {
    parseIds = await Ids.find();
  }
  let options;
  if (parseIds.length) {
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
  // Функция получения всех айдишек из первичного бэка и сохранения данных в свою БД для дальнейшего получения всех товаров
  const req = https.request(options, async (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", async () => {
      const responseJson = JSON.parse(responseData);
      // const uniqueIds = Array.from(new Set(responseJson.result));
      const newIds = new Ids({ ids: responseJson.result });
      await newIds.save();

      console.log("Данные успешно сохранены в MongoDB:", responseJson);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
};
module.exports = { fetchIdsAndSaveToMongoDB, fetchGoodsAndSaveToMongoDB };
