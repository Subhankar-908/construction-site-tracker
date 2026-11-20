const AuditLog = require("../models/AuditLog");
module.exports = (user, { project, log, action, details = "" }) =>
  AuditLog.create({ project, log, user: user._id, action, details });
