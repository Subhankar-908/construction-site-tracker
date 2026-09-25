import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {overview,projectDashboard} from "../controllers/dashboardController.js";
const r=Router();r.use(protect);r.get("/overview",overview);r.get("/project/:projectId",projectDashboard);export default r;
