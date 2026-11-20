const router = require("express").Router();
const Project = require("../models/Project");
const { protect, authorize } = require("../middleware/auth");
const { canAccess, accessibleProjectIds } = require("../utils/access");
const audit = require("../utils/audit");
const h = require("../utils/h");

router.use(protect);

router.get("/", h(async (req, res) => {
  const ids = await accessibleProjectIds(req.user);
  const q = ids ? { _id: { $in: ids } } : {};
  res.json(await Project.find(q).populate("manager supervisors", "name email").sort("-createdAt"));
}));

router.post("/", authorize("ADMIN", "MANAGER"), h(async (req, res) => {
  const b = req.body;
  if (!b.name) return res.status(400).json({ message: "Project name is required" });
  const project = await Project.create({
    name: b.name,
    location: b.location,
    status: b.status,
    plannedManpower: Number(b.plannedManpower) || 0,
    startDate: b.startDate || undefined,
    endDate: b.endDate || undefined,
    manager: req.user.role === "MANAGER" ? req.user._id : b.manager || undefined,
    supervisors: b.supervisors || [],
  });
  await audit(req.user, { project: project._id, action: "PROJECT_CREATED", details: project.name });
  res.status(201).json(project);
}));

router.get("/:id", h(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("manager supervisors", "name email");
  if (!canAccess(req.user, project)) return res.status(404).json({ message: "Project not found" });
  res.json(project);
}));

router.patch("/:id", authorize("ADMIN", "MANAGER"), h(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!canAccess(req.user, project)) return res.status(404).json({ message: "Project not found" });
  ["name", "location", "status", "plannedManpower", "startDate", "endDate", "supervisors"].forEach((k) => {
    if (req.body[k] !== undefined) project[k] = req.body[k];
  });
  if (req.user.role === "ADMIN" && req.body.manager) project.manager = req.body.manager;
  await project.save();
  await audit(req.user, { project: project._id, action: "PROJECT_UPDATED", details: project.name });
  res.json(project);
}));

module.exports = router;
