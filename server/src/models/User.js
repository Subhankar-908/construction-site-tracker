import mongoose from "mongoose";

const schema=new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true,minlength:6},
  role:{type:String,enum:["ADMIN","MANAGER","SUPERVISOR"],default:"SUPERVISOR"},
  assignedProjects:[{type:mongoose.Schema.Types.ObjectId,ref:"Project"}]
},{timestamps:true});

export default mongoose.model("User",schema);
