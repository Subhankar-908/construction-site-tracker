import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import {listProjects,getProject,createProject,updateProject,deleteProject} from "../controllers/projectController.js";
const r=Router();r.use(protect);r.get("/",listProjects);r.get("/:id",getProject);r.post("/",allowRoles("ADMIN","MANAGER"),createProject);r.put("/:id",allowRoles("ADMIN","MANAGER"),updateProject);r.delete("/:id",allowRoles("ADMIN"),deleteProject);export default r;
