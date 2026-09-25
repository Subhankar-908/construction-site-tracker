import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import {listAudit} from "../controllers/auditController.js";
const r=Router();r.use(protect,allowRoles("ADMIN","MANAGER"));r.get("/",listAudit);export default r;
