import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import {listMaterials,createMaterial,updateMaterial,deleteMaterial,addUsage,summary} from "../controllers/materialController.js";
const r=Router();r.use(protect);r.get("/",listMaterials);r.get("/summary/:projectId",summary);r.post("/",allowRoles("ADMIN","MANAGER"),createMaterial);r.put("/:id",allowRoles("ADMIN","MANAGER"),updateMaterial);r.delete("/:id",allowRoles("ADMIN","MANAGER"),deleteMaterial);r.post("/:id/usage",addUsage);export default r;
