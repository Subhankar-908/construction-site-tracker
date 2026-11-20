"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import ProjectSelect from "@/components/ProjectSelect";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Logs() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [pid, setPid] = useState("");
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => { api("/projects").then(setProjects).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    const qs = new URLSearchParams();
    if (pid) qs.set("project", pid);
    if (status) qs.set("status", status);
    api(`/logs?${qs}`).then(setLogs).catch((e) => setError(e.message));
  }, [pid, status]);

  return (
    <Shell title="Daily Logs">
      <div className="card row">
        <div><label>Project</label><ProjectSelect projects={projects} value={pid} onChange={setPid} allowAll /></div>
        <div>
          <label>Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {user?.role === "SUPERVISOR" && <div><Link className="btn gold" href="/logs/new">+ New daily log</Link></div>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <table>
          <thead><tr><th>Date</th><th>Project</th><th>Supervisor</th><th>Manpower</th><th>Progress</th><th>Delay</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{new Date(l.date).toLocaleDateString()}</td><td>{l.project?.name}</td><td>{l.supervisor?.name}</td>
                <td>{l.totalManpower}</td><td>{l.progressPercent}%</td><td>{l.delay?.hasDelay ? l.delay.reason || "Yes" : "-"}</td>
                <td><span className={`badge ${l.status}`}>{l.status}</span></td>
                <td><Link href={`/logs/${l._id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs.length && <p className="muted">No logs found.</p>}
      </div>
    </Shell>
  );
}
