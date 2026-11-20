"use client";
import { useEffect } from "react";

export default function ProjectSelect({ projects, value, onChange, allowAll = false }) {
  useEffect(() => {
    if (!value && !allowAll && projects.length) onChange(projects[0]._id);
  }, [projects, value, allowAll, onChange]);
  return (
    <select className="input" value={value || ""} onChange={(e) => onChange(e.target.value)}>
      {allowAll && <option value="">All projects</option>}
      {projects.map((p) => (
        <option key={p._id} value={p._id}>{p.name}</option>
      ))}
    </select>
  );
}
