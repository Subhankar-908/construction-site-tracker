const router = require("express").Router();
const DailyLog = require("../models/DailyLog");
const Material = require("../models/Material");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");
const { canAccess } = require("../utils/access");
const { computeRisks, weeklySummary } = require("../services/risk");
const h = require("../utils/h");

router.use(protect);

router.get("/:projectId", h(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!canAccess(req.user, project)) return res.status(404).json({ message: "Project not found" });

  const logs = await DailyLog.find({ project: project._id, status: { $in: ["SUBMITTED", "APPROVED"] } }).sort("date");
  const materials = await Material.find({ project: project._id });
  const statusAgg = await DailyLog.aggregate([{ $match: { project: project._id } }, { $group: { _id: "$status", n: { $sum: 1 } } }]);
  const day = (d) => d.toISOString().slice(0, 10);

  const reasons = {};
  logs.filter((l) => l.delay.hasDelay).forEach((l) => {
    const r = l.delay.reason || "Unspecified";
    reasons[r] = (reasons[r] || 0) + 1;
  });

  res.json({
    project: { name: project.name, progress: project.progress, status: project.status, plannedManpower: project.plannedManpower },
    counts: Object.fromEntries(statusAgg.map((s) => [s._id, s.n])),
    progressTrend: logs.map((l) => ({ date: day(l.date), progress: l.progressPercent })),
    manpowerTrend: logs.map((l) => ({ date: day(l.date), skilled: l.skilledWorkers, unskilled: l.unskilledWorkers })),
    delayReasons: Object.entries(reasons).map(([reason, count]) => ({ reason, count })),
    materials: materials.map((m) => ({
      name: m.name, unit: m.unit, planned: m.plannedQty, consumed: m.consumedQty,
      variance: m.consumedQty - m.plannedQty, stock: m.currentStock, minStock: m.minStock,
    })),
    risks: computeRisks(project, logs, materials),
    summary: weeklySummary(logs),
  });
}));

module.exports = router;
