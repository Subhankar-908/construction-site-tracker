import mongoose from "mongoose";

const schema=new mongoose.Schema({
  name:{type:String,required:true},
  location:String,
  clientName:String,
  startDate:Date,
  expectedEndDate:Date,
  status:{type:String,enum:["PLANNING","ONGOING","COMPLETED","ON_HOLD"],default:"PLANNING"},
  manager:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  supervisors:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  overallProgress:{type:Number,min:0,max:100,default:0}
},{timestamps:true});

export default mongoose.model("Project",schema);
