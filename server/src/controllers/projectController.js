import Project from "../models/Project.js";
import User from "../models/User.js";

function filterFor(user){
  if(user.role==="ADMIN")return {};
  return {$or:[{manager:user._id},{supervisors:user._id}]};
}
export async function listProjects(req,res,next){
  try{res.json({projects:await Project.find(filterFor(req.user)).populate("manager","name email").populate("supervisors","name email").sort({createdAt:-1})});}catch(e){next(e);}
}
export async function getProject(req,res,next){
  try{
    const p=await Project.findById(req.params.id).populate("manager","name email").populate("supervisors","name email");
    if(!p)return res.status(404).json({message:"Project not found"});
    res.json({project:p});
  }catch(e){next(e);}
}
export async function createProject(req,res,next){
  try{
    const p=await Project.create(req.body);
    const ids=[p.manager,...(p.supervisors||[])].filter(Boolean);
    await User.updateMany({_id:{$in:ids}},{$addToSet:{assignedProjects:p._id}});
    res.status(201).json({project:p});
  }catch(e){next(e);}
}
export async function updateProject(req,res,next){
  try{
    const p=await Project.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!p)return res.status(404).json({message:"Project not found"});
    res.json({project:p});
  }catch(e){next(e);}
}
export async function deleteProject(req,res,next){
  try{await Project.findByIdAndDelete(req.params.id);res.json({message:"Project deleted"});}catch(e){next(e);}
}
