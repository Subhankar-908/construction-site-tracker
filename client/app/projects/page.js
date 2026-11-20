"use client";
import { useCallback, useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", plannedManpower: "", supervisors: [] });
  const [error, setError] = useState("");
  const canEdit = user && ["ADMIN", "MANAGER"].includes(user.role);

  const load = useCallback(() => api("/projects").then(setProjects).catch((e) => setError(e.message)), []);
  useEffect(() => {
    load();
    if (canEdit) api("/users?role=SUPERVISOR").then(setSupervisors).catch(() => {});
  }, [load, canEdit]);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/projects", { method: "POST", body: form });
      setForm({ name: "", location: "", plannedManpower: "", supervisors: [] });
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <Shell title="Projects">
      {canEdit && (
        <form className="card" onSubmit={create}>
          <h2>New project</h2>
          <div className="row">
            <div><label>Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label>Location</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><label>Planned daily manpower</label><input className="input" type="number" min="0" value={form.plannedManpower} onChange={(e) => setForm({ ...form, plannedManpower: e.target.value })} /></div>
          </div>
          <label>Supervisors (hold Ctrl/Cmd to select several)</label>
          <select className="input" multiple value={form.supervisors} onChange={(e) => setForm({ ...form, supervisors: [...e.target.selectedOptions].map((o) => o.value) })}>
            {supervisors.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
          </select>
          {error && <p className="error">{error}</p>}
          <p><button className="btn">Create project</button></p>
        </form>
      )}
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Location</th><th>Status</th><th>Progress</th><th>Manager</th><th>Supervisors</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td><td>{p.location}</td><td><span className="badge">{p.status}</span></td><td>{p.progress}%</td>
                <td>{p.manager?.name || "-"}</td><td>{p.supervisors.map((s) => s.name).join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!projects.length && <p className="muted">No projects to show.</p>}
      </div>
    </Shell>
  );
}
