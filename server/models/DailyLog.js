const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    skilledWorkers: { type: Number, default: 0, min: 0 },
    unskilledWorkers: { type: Number, default: 0, min: 0 },
    totalManpower: { type: Number, default: 0 },
    workCompleted: { type: String, default: "" },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    delay: {
      hasDelay: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      details: { type: String, default: "" },
    },
    issues: { type: String, default: "" },
    photos: [{ url: String, publicId: String }],
    materialUsage: [
      { material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" }, quantity: { type: Number, min: 0 } },
    ],
    usageApplied: { type: Boolean, default: false },
    status: { type: String, enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"], default: "DRAFT" },
    submittedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
schema.pre("validate", function (next) {
  this.totalManpower = (this.skilledWorkers || 0) + (this.unskilledWorkers || 0);
  next();
});
module.exports = mongoose.model("DailyLog", schema);
