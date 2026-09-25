"use client";
import {useEffect,useState} from "react";import LayoutShell from "../components/LayoutShell";import {api} from "../lib/api";
export default function Audit(){const [logs,setLogs]=useState([]);useEffect(()=>{api("/audit").then(d=>setLogs(d.logs)).catch(console.error)},[]);
return <LayoutShell title="Audit Trail"><div className="panel table-wrap"><table><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Status</th></tr></thead><tbody>{logs.map(l=><tr key={l._id}><td>{new Date(l.createdAt).toLocaleString()}</td><td>{l.user?.name}</td><td>{l.action}</td><td>{l.entityType}</td><td>{l.oldStatus||"—"} → {l.newStatus||"—"}</td></tr>)}</tbody></table></div></LayoutShell>}
