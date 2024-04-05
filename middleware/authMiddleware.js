const md5 = require("md5");
module.exports = function getCheckSecretStamp(req, res, next) {
  const xAuthTimestamp = req.header("X-Auth");
  const timestamp = md5(
    `${process.env.SERVER_KEY}_${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}`
  );
  if (xAuthTimestamp !== timestamp) {
    return res.status(403).json({ success: false, message: "Нет доступа" });
  }
  next();
};
