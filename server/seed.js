// Development only: creates demo users, a project and materials
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");
const Project = require("./models/Project");
const Material = require("./models/Material");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const pw = await bcrypt.hash("Password@123", 10);
  const make = async (name, email, role) =>
    (await User.findOne({ email })) || User.create({ name, email, role, password: pw });
  await make("Site Admin", "admin@site.com", "ADMIN");
  const manager = await make("Maya Manager", "manager@site.com", "MANAGER");
  const sup = await make("Sam Supervisor", "supervisor@site.com", "SUPERVISOR");
  let project = await Project.findOne({ name: "Tower A Construction" });
  if (!project)
    project = await Project.create({ name: "Tower A Construction", location: "Kolkata", plannedManpower: 40, manager: manager._id, supervisors: [sup._id] });
  if (!(await Material.countDocuments({ project: project._id })))
    await Material.insertMany([
      { project: project._id, name: "Cement", unit: "bags", plannedQty: 500, currentStock: 300, minStock: 60 },
      { project: project._id, name: "Steel rods", unit: "kg", plannedQty: 2000, currentStock: 1200, minStock: 200 },
      { project: project._id, name: "Bricks", unit: "pcs", plannedQty: 10000, currentStock: 6000, minStock: 1000 },
    ]);
  console.log("Seeded. Login with admin@site.com / manager@site.com / supervisor@site.com, password: Password@123");
  process.exit(0);
})();
