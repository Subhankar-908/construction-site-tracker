const router = require("express").Router();
const multer = require("multer");
const DailyLog = require("../models/DailyLog");
const Material = require("../models/Material");
const Project = require("../models/Project");
const { protect, authorize } = require("../middleware/auth");
const { canAccess, accessibleProjectIds } = require("../utils/access");
const { enabled, uploadBuffer } = require("../config/cloudinary");
const audit = require("../utils/audit");
const h = require("../utils/h");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 5 } });
router.use(protect);

const savePhotos = async (files = []) => {
  if (!files.length) return [];
  if (!enabled()) throw Object.assign(new Error("Cloudinary is not configured on the server"), { status: 500 });
  return Promise.all(files.map((f) => uploadBuffer(f.buffer)));
};
const parseJSON = (v, fallback) => { try { return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const isOwner = (log, user) => String(log.supervisor._id || log.supervisor) === String(user._id);

const populate = (q) =>
  q.populate("project", "name manager supervisors").populate("supervisor", "name")
   .populate("comments.user", "name role").populate("materialUsage.material", "name unit");

const applyFields = (log, b) => {
  if (b.date) log.date = b.date;
  ["skilledWorkers", "unskilledWorkers", "progressPercent"].forEach((k) => { if (b[k] !== undefined) log[k] = Number(b[k]) || 0; });
  ["workCompleted", "issues"].forEach((k) => { if (b[k] !== undefined) log[k] = b[k]; });
  if (b.hasDelay !== undefined) log.delay.hasDelay = b.hasDelay === true || b.hasDelay === "true";
  if (b.delayReason !== undefined) log.delay.reason = b.delayReason;
  if (b.delayDetails !== undefined) log.delay.details = b.delayDetails;
  if (b.materialUsage !== undefined) {
    const arr = typeof b.materialUsage === "string" ? parseJSON(b.materialUsage, []) : b.materialUsage;
    log.materialUsage = arr.filter((m) => m.material && Number(m.quantity) > 0).map((m) => ({ material: m.material, quantity: Number(m.quantity) }));
  }
};

const submitLog = async (log, user) => {
  log.status = "SUBMITTED";
  log.submittedAt = new Date();
  if (!log.usageApplied) {
    for (const u of log.materialUsage) {
      await Material.updateOne({ _id: u.material, project: log.project._id || log.project }, { $inc: { consumedQty: u.quantity, currentStock: -u.quantity } });
    }
    log.usageApplied = true;
  }
  await log.save();
  await audit(user, { project: log.project._id || log.project, log: log._id, action: "LOG_SUBMITTED" });
};

router.get("/", h(async (req, res) => {
  const ids = await accessibleProjectIds(req.user);
  const q = {};
  if (req.query.project) {
    if (ids && !ids.some((i) => String(i) === req.query.project)) return res.json([]);
    q.project = req.query.project;
  } else if (ids) q.project = { $in: ids };
  if (req.query.status) q.status = req.query.status;
  if (req.user.role === "SUPERVISOR") q.supervisor = req.user._id;
  else if (req.user.role === "MANAGER" && !req.query.status) q.status = { $ne: "DRAFT" };
  res.json(await DailyLog.find(q).populate("project", "name").populate("supervisor", "name").sort("-date").limit(200));
}));

router.post("/", authorize("SUPERVISOR"), upload.array("photos", 5), h(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!canAccess(req.user, project)) return res.status(403).json({ message: "You are not assigned to this project" });
  const log = new DailyLog({ project: project._id, supervisor: req.user._id });
  applyFields(log, req.body);
  log.photos = await savePhotos(req.files);
  await log.save();
  await audit(req.user, { project: project._id, log: log._id, action: "LOG_CREATED" });
  if (req.body.submit === "true") await submitLog(log, req.user);
  res.status(201).json(log);
}));

router.get("/:id", h(async (req, res) => {
  const log = await populate(DailyLog.findById(req.params.id));
  if (!log || !canAccess(req.user, log.project)) return res.status(404).json({ message: "Log not found" });
  if (req.user.role === "SUPERVISOR" && !isOwner(log, req.user)) return res.status(403).json({ message: "Not your log" });
  res.json(log);
}));

router.patch("/:id", authorize("SUPERVISOR"), upload.array("photos", 5), h(async (req, res) => {
  const log = await DailyLog.findById(req.params.id);
  if (!log || !isOwner(log, req.user)) return res.status(404).json({ message: "Log not found" });
  if (!["DRAFT", "REJECTED"].includes(log.status)) return res.status(400).json({ message: "Only draft or rejected logs can be edited" });
  applyFields(log, req.body);
  log.photos.push(...(await savePhotos(req.files)));
  await log.save();
  await audit(req.user, { project: log.project, log: log._id, action: "LOG_UPDATED" });
  res.json(log);
}));

router.post("/:id/submit", authorize("SUPERVISOR"), h(async (req, res) => {
  const log = await DailyLog.findById(req.params.id);
  if (!log || !isOwner(log, req.user)) return res.status(404).json({ message: "Log not found" });
  if (!["DRAFT", "REJECTED"].includes(log.status)) return res.status(400).json({ message: "Log already submitted" });
  await submitLog(log, req.user);
  res.json(log);
}));

router.post("/:id/review", authorize("MANAGER", "ADMIN"), h(async (req, res) => {
  const { action, comment } = req.body;
  if (!["approve", "reject"].includes(action)) return res.status(400).json({ message: "action must be approve or reject" });
  if (action === "reject" && !comment) return res.status(400).json({ message: "A comment is required when rejecting" });
  const log = await DailyLog.findById(req.params.id);
  const project = log && (await Project.findById(log.project));
  if (!log || !canAccess(req.user, project)) return res.status(404).json({ message: "Log not found" });
  if (log.status !== "SUBMITTED") return res.status(400).json({ message: "Only submitted logs can be reviewed" });
  log.status = action === "approve" ? "APPROVED" : "REJECTED";
  log.reviewedBy = req.user._id;
  log.reviewedAt = new Date();
  if (comment) log.comments.push({ user: req.user._id, text: comment });
  await log.save();
  if (action === "approve" && log.progressPercent > project.progress) {
    project.progress = log.progressPercent;
    await project.save();
  }
  await audit(req.user, { project: project._id, log: log._id, action: action === "approve" ? "LOG_APPROVED" : "LOG_REJECTED", details: comment || "" });
  res.json(log);
}));

router.post("/:id/comments", h(async (req, res) => {
  if (!req.body.text) return res.status(400).json({ message: "Comment text is required" });
  const log = await populate(DailyLog.findById(req.params.id));
  if (!log || !canAccess(req.user, log.project)) return res.status(404).json({ message: "Log not found" });
  if (req.user.role === "SUPERVISOR" && !isOwner(log, req.user)) return res.status(403).json({ message: "Not your log" });
  log.comments.push({ user: req.user._id, text: req.body.text });
  await log.save();
  await audit(req.user, { project: log.project._id, log: log._id, action: "COMMENT_ADDED", details: req.body.text.slice(0, 120) });
  res.status(201).json(log.comments[log.comments.length - 1]);
}));

module.exports = router;
