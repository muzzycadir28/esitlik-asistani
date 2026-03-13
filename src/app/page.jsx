"use client";
import { useState } from "react";
import bgImage from "../lib/background.webp";
import RoleSelector from "../components/RoleSelector";
import OfficialPanel from "../components/panels/OfficialPanel";
import LocalGovPanel from "../components/panels/LocalGovPanel";
import AcademicPanel from "../components/panels/AcademicPanel";
import NGOPanel from "../components/panels/NGOPanel";

const LANDING_MENU = ["Ana Sayfa", "KEEDB Nedir?", "Nasıl Çalışır?", "Araçlar", "Kaynaklar", "Giriş"];

const css = `
:root{--bg:#F8F9FA;--surface:#FFFFFF;--primary:#2563EB;--accent:#2563EB;--text:#111827;--text-secondary:#6B7280;--border:#E5E7EB}
@media (prefers-color-scheme: dark){:root{--bg:#0B1220;--surface:#111827;--text:#F3F4F6;--text-secondary:#9CA3AF;--border:#273142}}
*{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--text)}
.header,.surface{background:color-mix(in oklab,var(--surface) 90%, transparent);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:12px}
.btn{border:1px solid var(--border);background:var(--surface);padding:.5rem .8rem;border-radius:8px;cursor:pointer;color:var(--text)}
.btn-primary{background:var(--primary);color:white;border-color:var(--primary)}
.btn-ghost{background:transparent}
.tab{border:none;background:none;padding:.3rem .1rem;margin:0 .35rem;border-bottom:2px solid transparent;color:var(--text-secondary);cursor:pointer}
.tab.active{color:var(--primary);border-color:var(--primary)}
input,textarea,select{width:100%;padding:.65rem;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text)}
.muted{color:var(--text-secondary)}
.chip,.seg{padding:.45rem .7rem;border:1px solid var(--border);border-radius:999px;background:var(--surface);cursor:pointer;color:var(--text)}
.seg.selected{background:var(--primary);color:#fff;border-color:var(--primary)}
`;

export default function Page() {
  const [lang, setLang] = useState("tr");
  const [role, setRole] = useState(null);

  const panelProps = { lang, setLang, role, setRole };

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      <style>{css}</style>
      {!role && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem" }}>
          <div className="header" style={{ padding: "0.8rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>{LANDING_MENU.map((item) => <a key={item} href="#" className="muted" style={{ textDecoration: "none" }}>{item}</a>)}</div>
            <button className="btn btn-ghost" onClick={() => setLang(lang === "tr" ? "en" : "tr")}>TR | EN</button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <RoleSelector lang={lang} role={role} setRole={setRole} />
          </div>
        </div>
      )}

      {!!role && <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem", display: "grid", gap: "1rem" }}>
        {role === "official" && <OfficialPanel {...panelProps} />}
        {role === "local" && <LocalGovPanel {...panelProps} />}
        {role === "academic" && <AcademicPanel {...panelProps} />}
        {role === "ngo" && <NGOPanel {...panelProps} />}
      </div>}
    </div>
  );
}
