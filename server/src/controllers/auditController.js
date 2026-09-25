import AuditLog from "../models/AuditLog.js";
export async function listAudit(req,res,next){
  try{
    const logs=await AuditLog.find().populate("user","name email").sort({createdAt:-1}).limit(200);
    res.json({logs});
  }catch(e){next(e);}
}
