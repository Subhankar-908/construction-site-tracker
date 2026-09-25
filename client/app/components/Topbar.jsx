"use client";
import {useRouter} from "next/navigation";
export default function Topbar({title}){const r=useRouter();return <header className="topbar"><div><h1>{title}</h1><p>Construction operations control center</p></div><button onClick={()=>{localStorage.removeItem("token");r.push("/login")}}>Logout</button></header>}
