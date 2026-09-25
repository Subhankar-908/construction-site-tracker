import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import {upload} from "../middleware/uploadMiddleware.js";
import {listLogs,getLog,createLog,updateLog,submitLog,reviewLog} from "../controllers/dailyLogController.js";
const r=Router();r.use(protect);r.get("/",listLogs);r.get("/:id",getLog);r.post("/",allowRoles("ADMIN","MANAGER","SUPERVISOR"),upload.array("photos",6),createLog);r.put("/:id",allowRoles("ADMIN","MANAGER","SUPERVISOR"),updateLog);r.patch("/:id/submit",submitLog);r.patch("/:id/review",allowRoles("ADMIN","MANAGER"),reviewLog);export default r;
