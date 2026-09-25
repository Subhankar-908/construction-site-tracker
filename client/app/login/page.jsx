"use client";
import {useState} from "react";import {useRouter} from "next/navigation";import {api} from "../lib/api";
export default function Login(){
 const [form,setForm]=useState({email:"",password:""}),[error,setError]=useState("");const router=useRouter();
 async function submit(e){e.preventDefault();try{const d=await api("/auth/login",{method:"POST",body:JSON.stringify(form)});localStorage.setItem("token",d.token);localStorage.setItem("user",JSON.stringify(d.user));router.push("/dashboard")}catch(e){setError(e.message)}}
 return <main className="auth"><form className="auth-card" onSubmit={submit}><div className="brand">🏗️</div><h1>Construction Site Tracker</h1><p>Sign in to manage site operations.</p><label>Email</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><label>Password</label><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{error&&<div className="error">{error}</div>}<button className="primary">Login</button><a href="/register">Create account</a></form></main>
}
