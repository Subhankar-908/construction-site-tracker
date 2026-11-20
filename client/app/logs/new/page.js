"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import ProjectSelect from "@/components/ProjectSelect";
import { api } from "@/lib/api";

const REASONS = ["Weather", "Material shortage", "Manpower shortage", "Equipment failure", "Design change", "Permit or approval", "Other"];

export default function NewLog() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [pid, setPid] = useState("");
  const [materials, setMaterials] = useState([]);
  const [usage, setUsage] = useState({});
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    date: new Date().toISOString().slice(0, 10), skilledWorkers: 0, unskilledWorkers: 0,
    workCompleted: "", progressPercent: 0, hasDelay: false, delayReason: REASONS[0], delayDetails: "", issues: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  useEffect(() => { api("/projects").then(setProjects).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    if (pid) api(`/materials?project=${pid}`).then((m) => { setMaterials(m); setUsage({}); }).catch(() => {});
  }, [pid]);

  const save = async (submit) => {
    setBusy(true); setError("");
    try {
      const fd = new FormData();
      fd.append("project", pid);
      Object.entries(f).forEach(([k, v]) => fd.append(k, v));
      fd.append("materialUsage", JSON.stringify(Object.entries(usage).map(([material, quantity]) => ({ material, quantity }))));
      fd.append("submit", submit ? "true" : "false");
      [...files].forEach((file) => fd.append("photos", file));
      const log = await api("/logs", { method: "POST", form: fd });
      router.push(`/logs/${log._id}`);
    } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <Shell title="New Daily Log">
      <div className="card">
        <div className="row">
          <div><label>Project</label><ProjectSelect projects={projects} value={pid} onChange={setPid} /></div>
          <div><label>Date</label><input className="input" type="date" value={f.date} onChange={set("date")} /></div>
        </div>
        <div className="row">
          <div><label>Skilled workers</label><input className="input" type="number" min="0" value={f.skilledWorkers} onChange={set("skilledWorkers")} /></div>
          <div><label>Unskilled workers</label><input className="input" type="number" min="0" value={f.unskilledWorkers} onChange={set("unskilledWorkers")} /></div>
          <div><label>Overall project progress (%)</label><input className="input" type="number" min="0" max="100" value={f.progressPercent} onChange={set("progressPercent")} /></div>
        </div>
        <label>Work completed</label>
        <textarea className="input" rows={3} value={f.workCompleted} onChange={set("workCompleted")} />
        <label><input type="checkbox" checked={f.hasDelay} onChange={set("hasDelay")} /> Delay occurred today</label>
        {f.hasDelay && (
          <div className="row">
            <div><label>Delay reason</label><select className="input" value={f.delayReason} onChange={set("delayReason")}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div><label>Delay details</label><input className="input" value={f.delayDetails} onChange={set("delayDetails")} /></div>
          </div>
        )}
        <label>Issues and remarks</label>
        <textarea className="input" rows={2} value={f.issues} onChange={set("issues")} />
      </div>
      <div className="card">
        <h2>Material used today</h2>
        {!materials.length && <p className="muted">No materials set up for this project yet.</p>}
        <div className="row">
          {materials.map((m) => (
            <div key={m._id}>
              <label>{m.name} ({m.unit}), stock {m.currentStock}</label>
              <input className="input" type="number" min="0" value={usage[m._id] || ""} onChange={(e) => setUsage({ ...usage, [m._id]: e.target.value })} />
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Site photos (up to 5, 5 MB each)</h2>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn ghost" style={{ color: "#003580" }} disabled={busy || !pid} onClick={() => save(false)}>Save draft</button>{" "}
      <button className="btn" disabled={busy || !pid} onClick={() => save(true)}>Submit for review</button>
    </Shell>
  );
}
