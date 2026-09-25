import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {allowRoles} from "../middleware/roleMiddleware.js";
import {listUsers,createUser,updateUser,deleteUser} from "../controllers/userController.js";
const r=Router();r.use(protect,allowRoles("ADMIN"));r.get("/",listUsers);r.post("/",createUser);r.put("/:id",updateUser);r.delete("/:id",deleteUser);export default r;
