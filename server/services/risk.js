// Rule-based risk signals and weekly summary (no external AI needed)
exports.computeRisks = (project, logs, materials) => {
  const risks = [];
  const recent = logs.slice(-7);

  if (project.plannedManpower > 0 && recent.length) {
    const last = recent.slice(-3);
    const avg = last.reduce((a, l) => a + l.totalManpower, 0) / last.length;
    if (avg < project.plannedManpower * 0.7)
      risks.push({ type: "LOW_MANPOWER", severity: "HIGH", message: `Average manpower ${avg.toFixed(0)} is below 70% of the planned ${project.plannedManpower}.` });
  }

  const delayed = recent.filter((l) => l.delay && l.delay.hasDelay);
  if (delayed.length >= 3)
    risks.push({ type: "REPEATED_DELAYS", severity: "HIGH", message: `${delayed.length} of the last ${recent.length} logs report delays.` });

  const reasons = {};
  delayed.forEach((l) => {
    const r = (l.delay.reason || "").trim();
    if (r) reasons[r] = (reasons[r] || 0) + 1;
  });
  Object.entries(reasons)
    .filter(([, n]) => n >= 2)
    .forEach(([r, n]) => risks.push({ type: "REPEATED_REASON", severity: "MEDIUM", message: `"${r}" caused delays ${n} times recently.` }));

  materials.forEach((m) => {
    if (m.plannedQty > 0 && m.consumedQty > m.plannedQty)
      risks.push({ type: "OVER_CONSUMPTION", severity: "HIGH", message: `${m.name}: consumed ${m.consumedQty} ${m.unit} against a plan of ${m.plannedQty}.` });
    else if (m.plannedQty > 0 && m.consumedQty >= m.plannedQty * 0.9)
      risks.push({ type: "NEAR_PLAN_LIMIT", severity: "MEDIUM", message: `${m.name}: 90% or more of the planned quantity is already used.` });
    if (m.currentStock <= m.minStock)
      risks.push({ type: "LOW_STOCK", severity: "HIGH", message: `${m.name}: stock ${m.currentStock} ${m.unit} is at or below the minimum ${m.minStock}.` });
  });
  return risks;
};

exports.weeklySummary = (logs) => {
  const week = logs.slice(-7);
  if (!week.length) return "No submitted logs yet.";
  const avg = week.reduce((a, l) => a + l.totalManpower, 0) / week.length;
  const delays = week.filter((l) => l.delay && l.delay.hasDelay);
  const counts = {};
  delays.forEach((l) => (counts[l.delay.reason || "Unspecified"] = (counts[l.delay.reason || "Unspecified"] || 0) + 1));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const gain = week[week.length - 1].progressPercent - week[0].progressPercent;
  const work = week.map((l) => l.workCompleted).filter(Boolean).slice(-3).map((w) => w.slice(0, 80)).join("; ");
  return [
    `${week.length} log(s) in the latest period, average manpower ${avg.toFixed(0)}.`,
    `Reported progress moved by ${gain >= 0 ? "+" : ""}${gain} percentage points.`,
    delays.length ? `${delays.length} delayed day(s); most common reason: ${top[0]}.` : "No delays reported.",
    work ? `Recent work: ${work}.` : "",
  ].filter(Boolean).join(" ");
};
