"use client";
import { useCallback, useEffect, useState } from "react";
import Shell from "@/components/Shell";
import ProjectSelect from "@/components/ProjectSelect";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Materials() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [pid, setPid] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", unit: "", plannedQty: "", currentStock: "", minStock: "" });
  const [error, setError] = useState("");
  const canEdit = user && ["ADMIN", "MANAGER"].includes(user.role);

  useEffect(() => { api("/projects").then(setProjects).catch((e) => setError(e.message)); }, []);
  const load = useCallback(() => { if (pid) api(`/materials?project=${pid}`).then(setItems).catch((e) => setError(e.message)); }, [pid]);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault(); setError("");
    try {
      await api("/materials", { method: "POST", body: { ...form, project: pid } });
      setForm({ name: "", unit: "", plannedQty: "", currentStock: "", minStock: "" });
      load();
    } catch (err) { setError(err.message); }
  };
  const restock = async (m) => {
    const qty = window.prompt(`Add stock for ${m.name} (${m.unit})`);
    if (!qty) return;
    try { await api(`/materials/${m._id}`, { method: "PATCH", body: { addStock: Number(qty) } }); load(); } catch (err) { setError(err.message); }
  };

  return (
    <Shell title="Material Consumption">
      <div className="card"><ProjectSelect projects={projects} value={pid} onChange={setPid} /></div>
      {canEdit && pid && (
        <form className="card" onSubmit={add}>
          <h2>Add material</h2>
          <div className="row">
            {[["name", "Name"], ["unit", "Unit"], ["plannedQty", "Planned qty"], ["currentStock", "Opening stock"], ["minStock", "Minimum stock"]].map(([k, l]) => (
              <div key={k}><label>{l}</label><input className="input" required={k === "name"} type={k === "name" || k === "unit" ? "text" : "number"} min="0" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
          </div>
          <p><button className="btn">Add material</button></p>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      <div className="card">
        <table>
          <thead><tr><th>Material</th><th>Planned</th><th>Consumed</th><th>Variance</th><th>Stock</th><th>Min</th><th>Alert</th>{canEdit && <th></th>}</tr></thead>
          <tbody>
            {items.map((m) => {
              const over = m.plannedQty > 0 && m.consumedQty > m.plannedQty;
              const low = m.currentStock <= m.minStock;
              return (
                <tr key={m._id} className={over || low ? "warn" : ""}>
                  <td>{m.name} ({m.unit})</td><td>{m.plannedQty}</td><td>{m.consumedQty}</td>
                  <td>{m.variance > 0 ? "+" : ""}{m.variance}</td><td>{m.currentStock}</td><td>{m.minStock}</td>
                  <td>{over && <span className="badge HIGH">Over plan</span>} {low && <span className="badge HIGH">Low stock</span>}</td>
                  {canEdit && <td><button className="btn ghost" style={{ color: "#003580" }} onClick={() => restock(m)}>Restock</button></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!items.length && <p className="muted">No materials for this project.</p>}
      </div>
    </Shell>
  );
}
