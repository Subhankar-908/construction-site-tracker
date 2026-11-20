const router = require("express").Router();
const Material = require("../models/Material");
const Project = require("../models/Project");
const { protect, authorize } = require("../middleware/auth");
const { canAccess, accessibleProjectIds } = require("../utils/access");
const audit = require("../utils/audit");
const h = require("../utils/h");

router.use(protect);

router.get("/", h(async (req, res) => {
  const ids = await accessibleProjectIds(req.user);
  const q = {};
  if (req.query.project) {
    if (ids && !ids.some((i) => String(i) === req.query.project)) return res.json([]);
    q.project = req.query.project;
  } else if (ids) q.project = { $in: ids };
  const items = await Material.find(q).sort("name");
  res.json(items.map((m) => ({ ...m.toObject(), variance: m.consumedQty - m.plannedQty })));
}));

router.post("/", authorize("ADMIN", "MANAGER"), h(async (req, res) => {
  const b = req.body;
  const project = await Project.findById(b.project);
  if (!canAccess(req.user, project)) return res.status(404).json({ message: "Project not found" });
  if (!b.name) return res.status(400).json({ message: "Material name is required" });
  const m = await Material.create({
    project: project._id, name: b.name, unit: b.unit || "unit",
    plannedQty: Number(b.plannedQty) || 0, currentStock: Number(b.currentStock) || 0, minStock: Number(b.minStock) || 0,
  });
  await audit(req.user, { project: project._id, action: "MATERIAL_ADDED", details: m.name });
  res.status(201).json(m);
}));

router.patch("/:id", authorize("ADMIN", "MANAGER"), h(async (req, res) => {
  const m = await Material.findById(req.params.id);
  if (!m) return res.status(404).json({ message: "Material not found" });
  const project = await Project.findById(m.project);
  if (!canAccess(req.user, project)) return res.status(404).json({ message: "Material not found" });
  ["name", "unit", "plannedQty", "minStock"].forEach((k) => { if (req.body[k] !== undefined) m[k] = req.body[k]; });
  if (req.body.addStock) m.currentStock += Number(req.body.addStock) || 0;
  await m.save();
  await audit(req.user, { project: m.project, action: "MATERIAL_UPDATED", details: m.name });
  res.json(m);
}));

module.exports = router;
