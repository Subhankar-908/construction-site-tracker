"use client";
import {useEffect,useState} from "react";import LayoutShell from "../components/LayoutShell";import {api} from "../lib/api";
export default function Dashboard(){
    const [m,setM]=useState(null),[error,setError]=useState("");
    useEffect(()=>{api("/dashboard/overview").then(d=>setM(d.metrics)).catch(e=>setError(e.message))},[]);
    return <LayoutShell title="Dashboard">{error&&<div className="error">{error}</div>}{m&&<><div className="stats"><Stat t="Projects" v={m.projects}/><Stat t="Average Progress" v={m.averageProgress+"%"}/><Stat t="Average Manpower" v={m.averageManpower}/><Stat t="Delays" v={m.delays}/><Stat t="Pending Reviews" v={m.submittedReports}/><Stat t="Low Stock" v={m.lowStockMaterials}/></div><div className="grid"><div className="panel"><h2>Material Variance</h2><div className="huge">{m.materialVariance}</div><p>Actual consumption minus planned consumption.</p></div><div className="panel"><h2>Reports</h2><p>Approved: <b>{m.approvedReports}</b></p><p>Pending: <b>{m.submittedReports}</b></p></div></div></>}</LayoutShell>
}
function Stat({t,v}){return <div className="stat"><span>{t}</span><b>{v}</b></div>}
