"use client";
import { useState } from "react";
import { LANG } from "../../lib/lang";
import { callClaude } from "../../lib/api";
import { buildSystemPrompt } from "./shared";

const buildReportPrompt = (lang, institution, year, sector, context) => lang === "tr"
  ? `${institution} kurumu için ${year} ${sector} KEEDB raporu taslağı. Ek bağlam: ${context || "-"}`
  : `GRB report draft for ${institution}, ${year}, ${sector}. Additional context: ${context || "-"}`;

export default function RaporOlustur({ lang, role }) {
  const L = LANG[lang];
  const [form, setForm] = useState({ institution: "", year: "", sector: "", context: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  return <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
    <input placeholder={L.report.institution} value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
    <input placeholder={L.report.year} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
    <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
      <option value="">{L.report.sector}</option>
      {L.checklist.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <textarea placeholder={L.report.contextPlaceholder} value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} />
    <button className="btn btn-primary" onClick={async () => {
      setLoading(true);
      setResult(await callClaude(buildReportPrompt(lang, form.institution, form.year, form.sector || L.checklist.sectors[0], form.context), buildSystemPrompt(lang, role)));
      setLoading(false);
    }} disabled={!form.institution || !form.year}>{loading ? L.report.generating : L.report.generate}</button>
    {result && <div className="surface" style={{ padding: "1rem", whiteSpace: "pre-wrap" }}>{result}</div>}
  </div>;
}
