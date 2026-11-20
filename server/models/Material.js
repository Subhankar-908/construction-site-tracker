const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    name: { type: String, required: true, trim: true },
    unit: { type: String, default: "unit" },
    plannedQty: { type: Number, default: 0 },
    consumedQty: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Material", schema);
