"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Shell from "@/components/Shell";
import ProjectSelect from "@/components/ProjectSelect";
import { api } from "@/lib/api";

const Chart = ({ title, children, empty }) => (
  <div className="card">
    <h2>{title}</h2>
    {empty ? <p className="muted">No data yet.</p> : <ResponsiveContainer width="100%" height={240}>{children}</ResponsiveContainer>}
  </div>
);

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [pid, setPid] = useState("");
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api("/projects").then(setProjects).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    if (!pid) return;
    api(`/dashboard/${pid}`).then(setD).catch((e) => setError(e.message));
  }, [pid]);

  return (
    <Shell title="Dashboard">
      <div className="card"><ProjectSelect projects={projects} value={pid} onChange={setPid} /></div>
      {error && <p className="error">{error}</p>}
      {!projects.length && <p className="muted">No projects yet. Create one on the Projects page.</p>}
      {d && (
        <>
          <div className="stats">
            <div className="stat"><b>{d.project.progress}%</b>Overall progress</div>
            <div className="stat"><b>{d.counts.SUBMITTED || 0}</b>Awaiting review</div>
            <div className="stat"><b>{d.counts.APPROVED || 0}</b>Approved logs</div>
            <div className="stat"><b>{d.risks.length}</b>Risk signals</div>
          </div>
          <div className="card">
            <h2>Risk signals</h2>
            {d.risks.length === 0 && <p className="muted">No risks detected.</p>}
            {d.risks.map((r, i) => (
              <div className="risk" key={i}><span className={`badge ${r.severity}`}>{r.severity}</span>{r.message}</div>
            ))}
          </div>
          <div className="card"><h2>Weekly progress note</h2><p>{d.summary}</p></div>
          <div className="grid">
            <Chart title="Progress trend (%)" empty={!d.progressTrend.length}>
              <LineChart data={d.progressTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0, 100]} /><Tooltip /><Line dataKey="progress" stroke="#003580" strokeWidth={2} /></LineChart>
            </Chart>
            <Chart title="Manpower trend" empty={!d.manpowerTrend.length}>
              <BarChart data={d.manpowerTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Bar dataKey="skilled" stackId="m" fill="#003580" /><Bar dataKey="unskilled" stackId="m" fill="#b8860b" /></BarChart>
            </Chart>
            <Chart title="Delay reasons" empty={!d.delayReasons.length}>
              <BarChart data={d.delayReasons}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="reason" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#b23a3a" /></BarChart>
            </Chart>
            <Chart title="Material: planned vs consumed" empty={!d.materials.length}>
              <BarChart data={d.materials}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="planned" fill="#8fa8d6" /><Bar dataKey="consumed" fill="#003580" /></BarChart>
            </Chart>
          </div>
        </>
      )}
    </Shell>
  );
}
