import mongoose from "mongoose";

const schema=new mongoose.Schema({
  project:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
  name:{type:String,required:true},
  unit:{type:String,required:true},
  plannedQuantity:{type:Number,required:true,min:0},
  currentStock:{type:Number,default:0,min:0},
  minimumStock:{type:Number,default:0,min:0}
},{timestamps:true});

export default mongoose.model("Material",schema);
