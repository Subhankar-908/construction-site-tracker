import Material from "../models/Material.js";
import MaterialUsage from "../models/MaterialUsage.js";

export async function listMaterials(req,res,next){
  try{res.json({materials:await Material.find(req.query.project?{project:req.query.project}:{ }).populate("project","name")});}catch(e){next(e);}
}
export async function createMaterial(req,res,next){
  try{res.status(201).json({material:await Material.create(req.body)});}catch(e){next(e);}
}
export async function updateMaterial(req,res,next){
  try{res.json({material:await Material.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})});}catch(e){next(e);}
}
export async function deleteMaterial(req,res,next){
  try{await Material.findByIdAndDelete(req.params.id);res.json({message:"Material deleted"});}catch(e){next(e);}
}
export async function addUsage(req,res,next){
  try{
    const m=await Material.findById(req.params.id);if(!m)return res.status(404).json({message:"Material not found"});
    const {date,consumedQuantity,plannedQuantity,dailyLog}=req.body;
    const usage=await MaterialUsage.create({project:m.project,material:m._id,dailyLog,date:date||new Date(),plannedQuantity:plannedQuantity??0,consumedQuantity,unit:m.unit,enteredBy:req.user._id});
    m.currentStock=Math.max(0,m.currentStock-Number(consumedQuantity));await m.save();
    res.status(201).json({usage,material:m});
  }catch(e){next(e);}
}
export async function summary(req,res,next){
  try{
    const materials=await Material.find({project:req.params.projectId});
    const out=[];
    for(const m of materials){
      const uses=await MaterialUsage.find({material:m._id});
      const consumed=uses.reduce((s,u)=>s+u.consumedQuantity,0);
      const variance=consumed-m.plannedQuantity;
      out.push({...m.toObject(),consumed,variance,variancePercent:m.plannedQuantity?(variance/m.plannedQuantity)*100:0,lowStock:m.currentStock<=m.minimumStock});
    }
    res.json({materials:out});
  }catch(e){next(e);}
}
