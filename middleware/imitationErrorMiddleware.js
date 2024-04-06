// Этот middleware предназначен для имитации ошибки на сервере для лишней работы на клиенте 
// Чтобы фронт принял меры для обработки ошибки и делал повторный запрос в случае ошибки (пусть помучается) 
// Вариант с глоб. перем. reqCount - это кастыль - возникли сложности при получении доступа к статической перем. класса Controller

let reqCount = 0;
module.exports = function imitationError(_, res, next) {
  reqCount = reqCount === 100 ? 1 : reqCount + 1;       
  if (!(reqCount % 5)) {
    return res.status(503).json({
      success: false,
      message: `Проблемы при обработке запроса`,
    });
  }
  next();
};
