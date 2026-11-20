"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import ProjectSelect from "@/components/ProjectSelect";
import { api } from "@/lib/api";

export default function Audit() {
  const [projects, setProjects] = useState([]);
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => { api("/projects").then(setProjects).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    api(`/audit${pid ? `?project=${pid}` : ""}`).then(setRows).catch((e) => setError(e.message));
  }, [pid]);

  return (
    <Shell title="Audit Trail">
      <div className="card"><ProjectSelect projects={projects} value={pid} onChange={setPid} allowAll /></div>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <table>
          <thead><tr><th>When</th><th>Project</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                <td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.project?.name}</td>
                <td>{r.user?.name} <span className="badge">{r.user?.role}</span></td><td>{r.action}</td><td>{r.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="muted">No activity recorded.</p>}
      </div>
    </Shell>
  );
}
