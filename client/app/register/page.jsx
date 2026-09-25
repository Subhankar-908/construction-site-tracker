"use client";
import {useState} from "react";import {useRouter} from "next/navigation";import {api} from "../lib/api";
export default function Register(){
 const [f,setF]=useState({name:"",email:"",password:"",role:"SUPERVISOR"}),[error,setError]=useState("");const r=useRouter();
 async function submit(e){e.preventDefault();try{const d=await api("/auth/register",{method:"POST",body:JSON.stringify(f)});localStorage.setItem("token",d.token);localStorage.setItem("user",JSON.stringify(d.user));r.push("/dashboard")}catch(e){setError(e.message)}}
 return <main className="auth"><form className="auth-card" onSubmit={submit}><h1>Create account</h1><label>Name</label><input required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/><label>Email</label><input type="email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/><label>Password</label><input type="password" minLength="6" required value={f.password} onChange={e=>setF({...f,password:e.target.value})}/><label>Role</label><select value={f.role} onChange={e=>setF({...f,role:e.target.value})}><option>SUPERVISOR</option><option>MANAGER</option><option>ADMIN</option></select>{error&&<div className="error">{error}</div>}<button className="primary">Register</button><a href="/login">Back to login</a></form></main>
}
