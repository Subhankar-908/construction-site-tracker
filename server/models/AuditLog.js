const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", index: true },
    log: { type: mongoose.Schema.Types.ObjectId, ref: "DailyLog" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("AuditLog", schema);
