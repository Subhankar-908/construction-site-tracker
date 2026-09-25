import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function listUsers(req,res,next){
  try{res.json({users:await User.find().select("-password").sort({name:1})});}catch(e){next(e);}
}
export async function createUser(req,res,next){
  try{
    const {name,email,password,role}=req.body;
    const exists=await User.findOne({email});
    if(exists)return res.status(409).json({message:"Email already exists"});
    const user=await User.create({name,email,password:await bcrypt.hash(password,12),role});
    res.status(201).json({user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(e){next(e);}
}
export async function updateUser(req,res,next){
  try{
    const body={...req.body};
    if(body.password) body.password=await bcrypt.hash(body.password,12);
    const user=await User.findByIdAndUpdate(req.params.id,body,{new:true}).select("-password");
    res.json({user});
  }catch(e){next(e);}
}
export async function deleteUser(req,res,next){
  try{await User.findByIdAndDelete(req.params.id);res.json({message:"User deleted"});}catch(e){next(e);}
}
