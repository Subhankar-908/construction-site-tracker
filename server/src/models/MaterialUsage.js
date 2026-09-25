import mongoose from "mongoose";

const schema=new mongoose.Schema({
  project:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
  material:{type:mongoose.Schema.Types.ObjectId,ref:"Material",required:true},
  dailyLog:{type:mongoose.Schema.Types.ObjectId,ref:"DailyLog"},
  date:{type:Date,required:true},
  plannedQuantity:{type:Number,default:0,min:0},
  consumedQuantity:{type:Number,required:true,min:0},
  unit:String,
  enteredBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true});

export default mongoose.model("MaterialUsage",schema);
