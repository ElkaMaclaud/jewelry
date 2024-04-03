// Этот контроллер предназначен для работы с первичном бэком для копирования из него всех данных в свою БД
// После сохранения всех данных в своей БД этот модуль будет не нужен
// На данном этапе требуется доработка моделей
// Данные функции нужно будет вызвать поочереди после подключения к MongoDB - это костыль (но нужно будет сделать всего раз)

const Id = require("../models/Id");
const Good = require("../models/Good");
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
//   port: port,
//   path: "/",
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "X-Auth": md5(
//       `${process.env.SERVER_KEY}_${new Date()
//         .toISOString()
//         .slice(0, 10)
//         .replace(/-/g, "")}`
//     ),
//     "Content-Length": data.length,
//   },
//   body: data,
// };

// const getAllIds = async () => {
//   ids = await Id.find();
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
    parseIds = await Id.find();
  }
  let options;
  if (parseIds.length) {
    const ids = parseIds.map(i=>i.id);
    options = await getOptions(ids);

    const req = https.request(options, async (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", async () => {
        const responseJson = JSON.parse(responseData);
        // const items = responseJson.filter(
        //   (elem, index, self) =>
        //     index === self.findIndex((i) => i.id === elem.id)
        // );
        // const set = new Set()
        // responseJson.forEach(elem => {
        //   if(!set.has(elem.id)) {
        //     set.add(elem.id)
        //     items.push(elem)
        //   }
        // });

        // const goods = new Good(items);
        // await goods.save();
        await Good.insertMany(responseJson.result);

        console.log(
          "Данные успешно сохранены в MongoDB:",
          responseJson.result.length
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
      const ids = responseJson.result.map((str) => ({ id: str }));
      await Id.insertMany(ids);
      console.log("Данные успешно сохранены в MongoDB:", ids.length, ids[8003]);
    });
  });


  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
};
module.exports = fetchGoodsAndSaveToMongoDB;
