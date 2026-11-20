const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    status: { type: String, enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"], default: "ACTIVE" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    plannedManpower: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    supervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Project", schema);
