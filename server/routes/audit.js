const router = require("express").Router();
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");
const { accessibleProjectIds } = require("../utils/access");
const h = require("../utils/h");

router.use(protect, authorize("ADMIN", "MANAGER"));

router.get("/", h(async (req, res) => {
  const ids = await accessibleProjectIds(req.user);
  const q = {};
  if (req.query.project) {
    if (ids && !ids.some((i) => String(i) === req.query.project)) return res.json([]);
    q.project = req.query.project;
  } else if (ids) q.project = { $in: ids };
  res.json(await AuditLog.find(q).populate("user", "name role").populate("project", "name").sort("-createdAt").limit(100));
}));

module.exports = router;
