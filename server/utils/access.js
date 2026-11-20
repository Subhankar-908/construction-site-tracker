const Project = require("../models/Project");

const canAccess = (user, project) => {
  if (!project) return false;
  if (user.role === "ADMIN") return true;
  const id = String(user._id);
  if (project.manager && String(project.manager._id || project.manager) === id) return true;
  return (project.supervisors || []).some((s) => String(s._id || s) === id);
};

// null = unrestricted (admin)
const accessibleProjectIds = async (user) => {
  if (user.role === "ADMIN") return null;
  const projects = await Project.find({ $or: [{ manager: user._id }, { supervisors: user._id }] }).select("_id");
  return projects.map((p) => p._id);
};

module.exports = { canAccess, accessibleProjectIds };
