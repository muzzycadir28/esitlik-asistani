"use client";
import { useState } from "react";
import { LANG } from "../../lib/lang";
import { CHECKLIST_PRESETS, CHECKLIST_PRESETS_EN } from "../../lib/presets";
import { callClaude } from "../../lib/api";
import { buildSystemPrompt } from "./shared";

const buildChecklistPrompt = (lang, phase, sector) => lang === "tr" ? `${phase} / ${sector} için KEEDB kontrol listesi oluştur.` : `Generate GRB checklist for ${phase} / ${sector}.`;

export default function RehberKontrol({ lang, role }) {
  const L = LANG[lang];
  const [phase, setPhase] = useState(0);
  const [sector, setSector] = useState(0);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  return <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
    {[{ label: L.checklist.phaseLabel, items: L.checklist.phases, val: phase, set: setPhase }, { label: L.checklist.sectorLabel, items: L.checklist.sectors, val: sector, set: setSector }].map(({ label, items, val, set }, idx) => (
      <div key={idx}><div className="muted">{label}</div><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>{items.map((it, i) => <button key={i} className={`seg ${val === i ? "selected" : ""}`} onClick={() => set(i)}>{it}</button>)}</div></div>
    ))}
    <button className="btn btn-primary" onClick={async () => {
      const phaseName = L.checklist.phases[phase];
      const sectorName = L.checklist.sectors[sector];
      const presets = lang === "en" ? CHECKLIST_PRESETS_EN : CHECKLIST_PRESETS;
      const preset = presets[phaseName]?.[sectorName];
      if (preset) return setResult(preset);
      setLoading(true);
      setResult(await callClaude(buildChecklistPrompt(lang, phaseName, sectorName), buildSystemPrompt(lang, role)));
      setLoading(false);
    }}>{loading ? L.checklist.generating : L.checklist.generate}</button>
    {result && <div className="surface" style={{ padding: "1rem", whiteSpace: "pre-wrap" }}>{result}</div>}
  </div>;
}
