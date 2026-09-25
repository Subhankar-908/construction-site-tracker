import Project from "../models/Project.js";
import DailyLog from "../models/DailyLog.js";
import Material from "../models/Material.js";
import MaterialUsage from "../models/MaterialUsage.js";

export async function overview(req,res,next){
  try{
    const pf=req.user.role==="ADMIN"?{}:{$or:[{manager:req.user._id},{supervisors:req.user._id}]};
    const projects=await Project.find(pf),ids=projects.map(p=>p._id);
    const logs=await DailyLog.find({project:{$in:ids}});
    const materials=await Material.find({project:{$in:ids}});
    const usages=await MaterialUsage.find({project:{$in:ids}});
    const progress=logs.length?logs.reduce((s,l)=>s+l.overallProgress,0)/logs.length:0;
    const manpower=logs.length?logs.reduce((s,l)=>s+l.manpower.total,0)/logs.length:0;
    const planned=usages.reduce((s,u)=>s+u.plannedQuantity,0),consumed=usages.reduce((s,u)=>s+u.consumedQuantity,0);
    res.json({metrics:{
      projects:projects.length,averageProgress:+progress.toFixed(1),averageManpower:+manpower.toFixed(1),
      delays:logs.filter(l=>l.delay.hasDelay).length,submittedReports:logs.filter(l=>l.status==="SUBMITTED").length,
      approvedReports:logs.filter(l=>l.status==="APPROVED").length,materialPlanned:planned,materialConsumed:consumed,
      materialVariance:consumed-planned,lowStockMaterials:materials.filter(m=>m.currentStock<=m.minimumStock).length
    },recentLogs:logs.sort((a,b)=>b.date-a.date).slice(0,10)});
  }catch(e){next(e);}
}
export async function projectDashboard(req,res,next){
  try{
    const logs=await DailyLog.find({project:req.params.projectId}).sort({date:1});
    const uses=await MaterialUsage.find({project:req.params.projectId});
    const reasons={};logs.forEach(l=>{if(l.delay.hasDelay){const r=l.delay.reason||"Other";reasons[r]=(reasons[r]||0)+1;}});
    res.json({progressTrend:logs.map(l=>({date:l.date,progress:l.overallProgress,manpower:l.manpower.total})),delayReasons:reasons,materialTrend:uses.map(u=>({date:u.date,planned:u.plannedQuantity,consumed:u.consumedQuantity}))});
  }catch(e){next(e);}
}
