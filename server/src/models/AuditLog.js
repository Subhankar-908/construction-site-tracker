import mongoose from "mongoose";

const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  action:String,
  entityType:String,
  entityId:mongoose.Schema.Types.ObjectId,
  oldStatus:String,
  newStatus:String,
  metadata:mongoose.Schema.Types.Mixed
},{timestamps:true});

export default mongoose.model("AuditLog",schema);
