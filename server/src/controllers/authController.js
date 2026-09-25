import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const safe=u=>({id:u._id,name:u.name,email:u.email,role:u.role});

export async function register(req,res,next){
  try{
    const {name,email,password,role="SUPERVISOR"}=req.body;
    if(!name||!email||!password) return res.status(400).json({message:"Name, email and password are required"});
    if(await User.findOne({email})) return res.status(409).json({message:"Email already registered"});
    const passwordHash=await bcrypt.hash(password,12);
    const user=await User.create({name,email,password:passwordHash,role});
    res.status(201).json({token:generateToken(user),user:safe(user)});
  }catch(e){next(e);}
}

export async function login(req,res,next){
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user||!(await bcrypt.compare(password,user.password))) return res.status(401).json({message:"Invalid email or password"});
    res.json({token:generateToken(user),user:safe(user)});
  }catch(e){next(e);}
}

export function me(req,res){res.json({user:req.user});}
