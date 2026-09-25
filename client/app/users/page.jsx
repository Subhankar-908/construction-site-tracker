"use client";
import {useEffect,useState} from "react";import LayoutShell from "../components/LayoutShell";import {api} from "../lib/api";
export default function Users(){const [users,setUsers]=useState([]);useEffect(()=>{api("/users").then(d=>setUsers(d.users)).catch(console.error)},[]);
return <LayoutShell title="Users"><div className="panel table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map(u=><tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td><span className="badge">{u.role}</span></td></tr>)}</tbody></table></div></LayoutShell>}
