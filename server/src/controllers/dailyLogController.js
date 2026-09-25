import DailyLog from "../models/DailyLog.js";
import AuditLog from "../models/AuditLog.js";
import {uploadImage} from "../config/cloudinary.js";

export async function listLogs(req,res,next){
  try{
    const filter={};
    if(req.query.project)filter.project=req.query.project;
    if(req.query.status)filter.status=req.query.status;
    if(req.user.role==="SUPERVISOR")filter.supervisor=req.user._id;
    const logs=await DailyLog.find(filter).populate("project","name").populate("supervisor","name email").sort({date:-1});
    res.json({logs});
  }catch(e){next(e);}
}
export async function getLog(req,res,next){
  try{
    const log=await DailyLog.findById(req.params.id).populate("project","name").populate("supervisor","name email");
    if(!log)return res.status(404).json({message:"Daily log not found"});
    res.json({log});
  }catch(e){next(e);}
}
export async function createLog(req,res,next){
  try{
    const b={...req.body,supervisor:req.user._id};
    for(const key of ["manpower","workCompleted","delay","issues"])if(typeof b[key]==="string")b[key]=JSON.parse(b[key]);
    const log=await DailyLog.create(b);
    if(req.files?.length){
      log.photos=[];
      for(const file of req.files)log.photos.push(await uploadImage(file.buffer,`construction/${b.project}`));
      await log.save();
    }
    await AuditLog.create({user:req.user._id,action:"CREATE_DAILY_LOG",entityType:"DAILY_LOG",entityId:log._id,newStatus:log.status});
    res.status(201).json({log});
  }catch(e){next(e);}
}
export async function updateLog(req,res,next){
  try{
    const log=await DailyLog.findById(req.params.id);
    if(!log)return res.status(404).json({message:"Daily log not found"});
    if(req.user.role==="SUPERVISOR" && String(log.supervisor)!==String(req.user._id))return res.status(403).json({message:"Not your log"});
    if(req.user.role==="SUPERVISOR"&&!["DRAFT","REJECTED"].includes(log.status))return res.status(400).json({message:"Only draft/rejected logs can be edited"});
    Object.assign(log,req.body);await log.save();res.json({log});
  }catch(e){next(e);}
}
export async function submitLog(req,res,next){
  try{
    const log=await DailyLog.findById(req.params.id);
    if(!log)return res.status(404).json({message:"Daily log not found"});
    if(req.user.role==="SUPERVISOR"&&String(log.supervisor)!==String(req.user._id))return res.status(403).json({message:"Not your log"});
    const old=log.status;log.status="SUBMITTED";log.submittedAt=new Date();await log.save();
    await AuditLog.create({user:req.user._id,action:"SUBMIT_DAILY_LOG",entityType:"DAILY_LOG",entityId:log._id,oldStatus:old,newStatus:"SUBMITTED"});
    res.json({log});
  }catch(e){next(e);}
}
export async function reviewLog(req,res,next){
  try{
    const {action,comment=""}=req.body;
    if(!["APPROVED","REJECTED"].includes(action))return res.status(400).json({message:"Invalid review action"});
    const log=await DailyLog.findById(req.params.id);
    if(!log)return res.status(404).json({message:"Daily log not found"});
    if(log.status!=="SUBMITTED")return res.status(400).json({message:"Only submitted logs can be reviewed"});
    const old=log.status;log.status=action;log.managerComment=comment;log.reviewedAt=new Date();await log.save();
    await AuditLog.create({user:req.user._id,action:`${action}_DAILY_LOG`,entityType:"DAILY_LOG",entityId:log._id,oldStatus:old,newStatus:action,metadata:{comment}});
    res.json({log});
  }catch(e){next(e);}
}
