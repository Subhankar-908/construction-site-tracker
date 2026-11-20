"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Shell from "@/components/Shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [log, setLog] = useState(null);
  const [comment, setComment] = useState("");
  const [edit, setEdit] = useState({ workCompleted: "", progressPercent: 0, issues: "" });
  const [error, setError] = useState("");

  const load = useCallback(() => api(`/logs/${id}`).then((l) => {
    setLog(l);
    setEdit({ workCompleted: l.workCompleted, progressPercent: l.progressPercent, issues: l.issues });
  }).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); }, [load]);

  const run = (fn) => async () => { setError(""); try { await fn(); setComment(""); await load(); } catch (e) { setError(e.message); } };
  const review = (action) => run(() => api(`/logs/${id}/review`, { method: "POST", body: { action, comment } }));
  const addComment = run(() => api(`/logs/${id}/comments`, { method: "POST", body: { text: comment } }));
  const submit = run(async () => {
    if (log.status === "REJECTED") await api(`/logs/${id}`, { method: "PATCH", body: edit });
    await api(`/logs/${id}/submit`, { method: "POST" });
  });

  if (!log) return <Shell title="Daily Log">{error ? <p className="error">{error}</p> : <p className="muted">Loading...</p>}</Shell>;
  const mine = user.role === "SUPERVISOR";
  const canReview = ["MANAGER", "ADMIN"].includes(user.role) && log.status === "SUBMITTED";
  const canSubmit = mine && ["DRAFT", "REJECTED"].includes(log.status);

  return (
    <Shell title={`${log.project.name}: ${new Date(log.date).toLocaleDateString()}`}>
      <div className="card">
        <p><span className={`badge ${log.status}`}>{log.status}</span> Supervisor: {log.supervisor.name}</p>
        <div className="stats">
          <div className="stat"><b>{log.totalManpower}</b>Manpower ({log.skilledWorkers} skilled, {log.unskilledWorkers} unskilled)</div>
          <div className="stat"><b>{log.progressPercent}%</b>Reported progress</div>
          <div className="stat"><b>{log.delay.hasDelay ? log.delay.reason : "None"}</b>Delay</div>
        </div>
        {canSubmit && log.status === "REJECTED" ? (
          <>
            <label>Work completed</label><textarea className="input" rows={3} value={edit.workCompleted} onChange={(e) => setEdit({ ...edit, workCompleted: e.target.value })} />
            <label>Progress (%)</label><input className="input" type="number" min="0" max="100" value={edit.progressPercent} onChange={(e) => setEdit({ ...edit, progressPercent: e.target.value })} />
            <label>Issues</label><textarea className="input" rows={2} value={edit.issues} onChange={(e) => setEdit({ ...edit, issues: e.target.value })} />
          </>
        ) : (
          <>
            <h2>Work completed</h2><p>{log.workCompleted || "-"}</p>
            {log.delay.hasDelay && <><h2>Delay details</h2><p>{log.delay.details || "-"}</p></>}
            <h2>Issues and remarks</h2><p>{log.issues || "-"}</p>
          </>
        )}
        {log.materialUsage.length > 0 && (
          <><h2>Material used</h2><ul>{log.materialUsage.map((m, i) => <li key={i}>{m.material?.name}: {m.quantity} {m.material?.unit}</li>)}</ul></>
        )}
        {log.photos.length > 0 && <div className="photos">{log.photos.map((p) => <a key={p.publicId} href={p.url} target="_blank" rel="noreferrer"><img src={p.url} alt="Site" /></a>)}</div>}
        {canSubmit && <p><button className="btn" onClick={submit}>{log.status === "REJECTED" ? "Resubmit for review" : "Submit for review"}</button></p>}
      </div>
      <div className="card">
        <h2>Review comments</h2>
        {!log.comments.length && <p className="muted">No comments yet.</p>}
        {log.comments.map((c) => (
          <p key={c._id}><strong>{c.user?.name}</strong> <span className="muted">({new Date(c.at).toLocaleString()})</span><br />{c.text}</p>
        ))}
        <textarea className="input" rows={2} placeholder="Write a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        <p>
          <button className="btn ghost" style={{ color: "#003580" }} disabled={!comment} onClick={addComment}>Add comment</button>{" "}
          {canReview && <><button className="btn green" onClick={review("approve")}>Approve</button>{" "}<button className="btn red" disabled={!comment} onClick={review("reject")}>Reject (comment required)</button></>}
        </p>
      </div>
      {error && <p className="error">{error}</p>}
    </Shell>
  );
}
