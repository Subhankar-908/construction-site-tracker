const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const h = require("../utils/h");

router.use(protect);

router.get("/", authorize("ADMIN", "MANAGER"), h(async (req, res) => {
  const q = req.query.role ? { role: req.query.role } : {};
  res.json(await User.find(q).select("name email role").sort("name"));
}));

router.post("/", authorize("ADMIN"), h(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "name, email and password are required" });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: role || "SUPERVISOR" });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
}));

router.patch("/:id/role", authorize("ADMIN"), h(async (req, res) => {
  if (!["ADMIN", "MANAGER", "SUPERVISOR"].includes(req.body.role)) return res.status(400).json({ message: "Invalid role" });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("name email role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}));

module.exports = router;
