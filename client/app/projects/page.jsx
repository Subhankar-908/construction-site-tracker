"use client";
import {useEffect,useState} from "react";import Link from "next/link";import LayoutShell from "../components/LayoutShell";import {api} from "../lib/api";
export default function Projects(){const [items,setItems]=useState([]);useEffect(()=>{api("/projects").then(d=>setItems(d.projects)).catch(console.error)},[]);
return <LayoutShell title="Projects"><div className="page-actions"><Link className="primary link" href="/projects/create">+ New Project</Link></div><div className="cards">{items.map(p=><div className="panel" key={p._id}><h2>{p.name}</h2><p>{p.location||"Location not set"}</p><div className="progress"><span style={{width:`${p.overallProgress}%`}}/></div><b>{p.overallProgress}%</b><p><span className="badge">{p.status}</span></p></div>)}</div></LayoutShell>}
