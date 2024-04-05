module.exports = function getCheckSecretStamp(req, res, next) {
  if (this.timestamp !== this.timestamp) {
    return res.status(403).json({ success: false, message: "Нет доступа" });
  }
  next();
};
