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

  const [phase, setPhase] = useState(0);
  const [sector, setSector] = useState(0);
  const [clResult, setClResult] = useState("");
  const [clLoading, setClLoading] = useState(false);

  const [rpForm, setRpForm] = useState({ institution: "", year: String(new Date().getFullYear()), sector: "", context: "" });
  const [rpResult, setRpResult] = useState("");
  const [rpLoading, setRpLoading] = useState(false);

  const sendChat = async (override, fromQuick = false) => {
    const text = override ?? chatInput;
    if (!text.trim() || chatLoading) return;
    if (fromQuick) setActiveQuick(text);
    else setActiveQuick(null);
    setChatInput("");
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    requestAnimationFrame(() => {
      lastUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const presetReply = getQuickPresetResponse(lang, text);
    if (presetReply) {
      setMessages([...newHistory, { role: "assistant", content: presetReply }]);
      requestAnimationFrame(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    setChatLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(text, buildSystemPrompt(lang, role), history, lang, role);
      setMessages([...newHistory, { role: "assistant", content: reply }]);
      requestAnimationFrame(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      const msg = lang === "tr"
        ? `Üzgünüm, yanıt üretilirken bir hata oluştu: ${error.message}`
        : `Sorry, an error occurred while generating the response: ${error.message}`;
      setMessages([...newHistory, { role: "assistant", content: msg }]);
      requestAnimationFrame(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } finally {
      setChatLoading(false);
    }
  };

  const lastAssistantIndex = [...messages].map((m) => m.role).lastIndexOf("assistant");
  const lastUserIndex = [...messages].map((m) => m.role).lastIndexOf("user");

  const quickGroups = lang === "tr" ? [
    {
      title: "KEEDB Nedir?",
      questions: ["KEEDB nedir ve neden önemlidir?", "KEEDB sadece kadınlara yönelik bir bütçe midir?"],
    },
    {
      title: "Araçlar & Uygulama",
      questions: ["KEEDB'nin temel araçları nelerdir?", "KEEDB hangi politika döngüsü aşamalarında uygulanabilir?", "KEEDB için hangi ilk adımları atabiliriz?", "Planları ve bütçeleri nasıl duyarlı hale getirebilirim?"],
    },
    {
      title: "Örnekler",
      questions: ["Dünya'dan başarılı örnekler paylaşır mısın?", "Türkiye'den başarılı bir örnek paylaşır mısın?"],
    },
  ] : [
    {
      title: "What is GRB?",
      questions: ["What is GRB and why does it matter?", "Is GRB only a budget for women?"],
    },
    {
      title: "Tools & Application",
      questions: ["What are the core tools of GRB?", "At which policy cycle stages can GRB be applied?", "What are the first steps we can take for GRB?", "How can I make plans and budgets gender-responsive?"],
    },
    {
      title: "Examples",
      questions: ["Can you share successful examples from around the world?", "Can you share a successful example from Turkey?"],
    },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    :root{--bg:#F8F9FA;--surface:#FFFFFF;--primary:#2563EB;--accent:#2563EB;--accent-soft:color-mix(in oklab,var(--accent) 10%, var(--surface));--text:#111827;--text-secondary:#6B7280;--border:#E5E7EB;--shadow:0 8px 24px rgba(15,23,42,.06);--role-gradient:linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);--role-gradient-active:linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)}
    @media (prefers-color-scheme: dark){:root{--bg:#0F172A;--surface:#1E293B;--primary:#3B82F6;--accent:#3B82F6;--accent-soft:color-mix(in oklab,var(--accent) 16%, var(--surface));--text:#F1F5F9;--text-secondary:#94A3B8;--border:#334155;--shadow:0 8px 24px rgba(2,6,23,.45);--role-gradient:linear-gradient(135deg, #2563EB 0%, #1e40af 100%);--role-gradient-active:linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)}}
    *{box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
    .app{min-height:100vh;color:var(--text)}
    .surface{background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow)}
    .header{border-bottom:1px solid var(--border);background:var(--surface)}
    .btn{border-radius:10px;padding:.65rem 1rem;font-family:inherit;font-size:.92rem;font-weight:500;cursor:pointer;transition:.2s all;border:1px solid transparent}
    .btn-primary{background:var(--primary);color:#fff}.btn-primary:hover:not(:disabled){filter:brightness(1.05)}
    .btn-ghost{background:var(--surface);color:var(--text);border-color:var(--border)} .btn-ghost:hover:not(:disabled){border-color:var(--primary);color:var(--primary)}
    .btn:disabled{opacity:.55;cursor:not-allowed}
    .tab{background:none;border:none;border-bottom:2px solid transparent;padding:.95rem 1rem;cursor:pointer;color:var(--text-secondary);font-weight:500}
    .tab.active{border-bottom-color:var(--primary);color:var(--primary)}
    .chip,.seg{width:100%;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.65rem .8rem;color:var(--text);font-size:.9rem;cursor:pointer;transition:.2s all}
    .chip:hover,.seg:hover{border-color:var(--primary)} .seg.selected{background:color-mix(in oklab,var(--primary) 10%, var(--surface));border-color:var(--primary);color:var(--primary)}
    input,textarea,select{width:100%;padding:.65rem .75rem;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit;line-height:1.6}
    input:focus,textarea:focus,select:focus{outline:2px solid color-mix(in oklab,var(--primary) 35%, transparent);border-color:var(--primary)}
    input::placeholder,textarea::placeholder{color:var(--text-secondary)}
    .muted{color:var(--text-secondary)}
    .fade{animation:fadeUp .3s ease}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .pulse{animation:pulse 1.3s infinite}@keyframes pulse{50%{opacity:.4}}
    .md-content h1{font-size:1.3rem;font-weight:600;margin:1rem 0 .4rem;border-bottom:1px solid var(--border);padding-bottom:.35rem}
    .md-content h2{font-size:1.15rem;font-weight:600;margin:.9rem 0 .35rem}
    .md-content h3{font-size:1rem;font-weight:600;margin:.8rem 0 .3rem}
    .md-content p,.md-content li{font-size:.95rem;line-height:1.75}
    .md-content strong{color:var(--primary);font-weight:600}
    .md-content ul,.md-content ol{padding-left:1.2rem;margin:.35rem 0}
    .main-container{max-width:100%;margin:1.2rem auto;padding:16px}
    .card{width:100%}
    .header-top{display:flex;justify-content:space-between;align-items:center;gap:.6rem;flex-wrap:wrap}
    .header-brand{display:flex;gap:.7rem;align-items:center}
    .header-actions{display:flex;gap:.5rem}
    .app-title{font-size:1.15rem;font-weight:600}
    .app-subtitle{font-size:.8rem}
    .advisor-layout{padding:0;display:flex;flex-direction:row;height:calc(100vh - 160px);overflow:hidden}
    .advisor-quick-panel{width:280px;flex-shrink:0;border-right:1px solid var(--border);padding:1rem;position:sticky;top:0;align-self:flex-start}
    .advisor-quick-list{display:grid;grid-template-columns:1fr;gap:.5rem}
    .advisor-chat-panel{flex:1;min-width:0;min-height:0}
    .advisor-chat-messages{display:grid;gap:.75rem;background:var(--surface)}
    .advisor-input-row{display:flex;gap:.5rem}
    .quick-group{overflow:hidden;transition:max-height .3s ease,opacity .3s ease;opacity:0;max-height:0}
    .quick-group.open{opacity:1;max-height:360px}
    @media (max-width: 768px){
      .two-col{flex-direction:column !important}
      .sidebar{width:100% !important;max-height:280px;overflow-y:auto}
      .chat-panel{height:calc(100vh - 420px) !important}
      .card{border-radius:8px !important}
      .header-top{flex-direction:column;align-items:flex-start}
      .header-actions{width:100%;flex-direction:column}
      .header-actions .btn{width:100%}
      .app-title{font-size:1rem}
      .app-subtitle{font-size:.74rem}
      .advisor-quick-panel{position:static;border-right:none;border-bottom:1px solid var(--border)}
      .advisor-chat-messages{max-height:none}
    }
    @media (min-width: 1400px){
      .main-container{max-width:1300px !important}
    }
  `;

  const resultCard = (content) => content && <div className="surface fade" style={{ padding: "1rem 1.2rem" }}><MD text={content} /></div>;

  if (!role) return (
    <div className="app" suppressHydrationWarning style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <style>{css}</style>
      <div className="header" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600 }}>⚖</div>
          <div><div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{L.appTitle}</div><div className="muted" style={{ fontSize: ".85rem" }}>{L.appSubtitle}</div></div>
        </div>
        <button className="btn btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")}>{L.langToggle}</button>
      </div>
      <div className="main-container" style={{ marginTop: "2.5rem" }}>
        <div className="surface" style={{ padding: "1.4rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 600 }}>{L.roleSelect.title}</h1>
          <p className="muted" style={{ margin: ".4rem 0 1.3rem" }}>{L.roleSelect.subtitle}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "0.9rem" }}>
            {L.roleSelect.roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  background: role === r.id ? "var(--role-gradient-active)" : "var(--role-gradient)",
                  border: role === r.id ? "2px solid rgba(255,255,255,0.5)" : "none",
                  borderRadius: 16,
                  padding: "28px 24px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: role === r.id ? "0 14px 32px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)" : "0 8px 24px rgba(37,99,235,0.35)",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  display: "grid",
                  gap: "0.45rem",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = role === r.id
                    ? "0 14px 32px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)"
                    : "0 14px 32px rgba(37,99,235,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = role === r.id
                    ? "0 14px 32px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.2)"
                    : "0 8px 24px rgba(37,99,235,0.35)";
                }}
              >
                <div style={{ fontSize: "2em", lineHeight: 1 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "1.1em", color: "#fff" }}>{r.label}</div>
                <div style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.75)" }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `url(${bgImage.src})`, backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      <style>{css}</style>
      <div className="header" style={{ padding: "0.8rem 1.2rem" }}>
        <div className="header-top">
        <div className="header-brand">
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600 }}>⚖</div>
          <div><div className="app-title">{L.appTitle}</div><div className="muted app-subtitle">{L.appSubtitle}</div></div>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => { setRole(null); }}>{L.chat.changeRole}</button>
          <button className="btn btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")}>{L.langToggle}</button>
        </div>
        </div>
      </div>

      <div className="header" style={{ display: "flex", padding: "0 1rem", gap: "0.25rem", overflowX: "auto" }}>
        {L.tabs.map((t, i) => <button key={i} className={`tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>)}
      </div>

      <div className="main-container" style={{ paddingBottom: "1.5rem" }}>
        {activeTab === 0 && (
          <div className="surface advisor-layout two-col card">
            <div className="advisor-quick-panel sidebar">
              <div className="muted" style={{ fontSize: ".86rem", marginBottom: ".4rem", fontWeight: 500 }}>{L.chat.quickTitle}</div>
              <div className="advisor-quick-list">
                {quickGroups.map((group, i) => {
                  const isOpen = openGroup === i;
                  return (
                    <div key={group.title}>
                      <button
                        className="btn"
                        onClick={() => setOpenGroup(isOpen ? -1 : i)}
                        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--accent-soft)", borderRadius: 8, padding: "10px 14px", fontWeight: 600, border: "1px solid var(--border)", color: "var(--text)" }}
                      >
                        <span>{group.title}</span>
                        <span>{isOpen ? "▲" : "▼"}</span>
                      </button>
                      <div className={`quick-group ${isOpen ? "open" : ""}`}>
                        <div style={{ display: "grid", gap: ".5rem", marginTop: ".5rem" }}>
                          {group.questions.map((q, questionIndex) => (
                            <button key={questionIndex} className="chip" onClick={() => sendChat(q, true)} style={{ background: activeQuick === q ? "var(--accent)" : "var(--surface)", color: activeQuick === q ? "#ffffff" : "var(--text-secondary)", border: `1px solid ${activeQuick === q ? "var(--accent)" : "var(--border)"}`, fontWeight: activeQuick === q ? 600 : 400 }}>{q}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="advisor-chat-panel chat-panel">
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
              overflow: "hidden"
            }}>
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                minHeight: 0
              }}>
                <div className="advisor-chat-messages">
                  {messages.map((m, i) => <div key={i} className="fade" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div ref={m.role === "assistant" && i === lastAssistantIndex ? lastAssistantRef : m.role === "user" && i === lastUserIndex ? lastUserMsgRef : null} className="surface" style={{ maxWidth: "82%", padding: "0.8rem 0.9rem", borderRadius: 10, background: m.role === "user" ? "color-mix(in oklab,var(--primary) 14%, var(--surface))" : "var(--surface)" }}>{m.role === "assistant" ? <MD text={m.content} /> : <p style={{ margin: 0 }}>{m.content}</p>}</div></div>)}
                  {chatLoading && <div ref={endRef} className="muted pulse">{L.chat.thinking}</div>}
                </div>
              </div>
              <div style={{
                flexShrink: 0,
                borderTop: "1px solid var(--border)",
                padding: "12px 16px",
                background: "var(--surface)",
                display: "flex",
                gap: 9
              }}>
                <textarea value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }} placeholder={L.chat.placeholder} style={{ height: 64, resize: "none" }} />
                <button className="btn btn-primary" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}>{L.chat.send}</button>
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="surface card" style={{ width: "100%", padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.docAnalysis.title}</div><div className="muted">{L.docAnalysis.subtitle}</div></div>
            <div>
              <div className="muted" style={{ fontWeight: 500, marginBottom: ".4rem" }}>{L.docAnalysis.uploadSection}</div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) await handleDocFile(f);
                }}
              />
              <div
                role="button"
                tabIndex={0}
                style={{
                  border: `2px dashed ${docDragActive ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: 10,
                  padding: "1.2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: docDragActive ? "rgba(37,99,235,.06)" : "transparent",
                }}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDocDragActive(true);
                }}
                onDragLeave={() => setDocDragActive(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDocDragActive(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) await handleDocFile(f);
                }}
              >
                <div style={{ fontSize: "1.6rem" }}>📄</div><div>{L.docAnalysis.upload}</div><div className="muted" style={{ fontSize: ".85rem" }}>{L.docAnalysis.uploadHint}</div>
                {docFileName && (
                  <div className="muted" style={{ marginTop: ".5rem", fontSize: ".85rem" }}>
                    {L.docAnalysis.selectedFile}: <strong>{docFileName}</strong> • {docFileChars} {L.docAnalysis.charCount}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="muted" style={{ fontWeight: 500 }}>{L.docAnalysis.pasteSection}</div>
              <textarea value={pastedDocText} onChange={e => setPastedDocText(e.target.value)} placeholder={L.docAnalysis.pastePlaceholder} style={{ minHeight: 150 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
              <div className="muted" style={{ fontSize: ".85rem" }}>{L.docAnalysis.wordCount}: {analysisWordCount}</div>
              <button className="btn" onClick={clearDocInputs}>{L.docAnalysis.clear}</button>
            </div>
              <button className="btn btn-primary" onClick={async () => { setDocLoading(true); setDocResult(""); const r = await callClaude(buildDocPrompt(lang, analysisText), buildSystemPrompt(lang, role)); setDocResult(r); setDocLoading(false); }} disabled={docLoading || !analysisText.trim()}>{docLoading ? L.docAnalysis.analyzing : L.docAnalysis.analyze}</button>
            {docLoading && <span className="muted pulse">{L.docAnalysis.analyzing}</span>}
            {resultCard(docResult)}
          </div>
        )}

        {activeTab === 2 && (
          <div className="surface card" style={{ width: "100%", padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.checklist.title}</div><div className="muted">{L.checklist.subtitle}</div></div>
            {[{ label: L.checklist.phaseLabel, items: L.checklist.phases, val: phase, set: setPhase }, { label: L.checklist.sectorLabel, items: L.checklist.sectors, val: sector, set: setSector }].map(({ label, items, val, set }, idx) => (
              <div key={idx}><div className="muted" style={{ fontWeight: 500, marginBottom: ".4rem" }}>{label}</div><div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>{items.map((it, i) => <button key={i} className={`seg ${val === i ? "selected" : ""}`} onClick={() => set(i)} style={{ width: "auto" }}>{it}</button>)}</div></div>
            ))}
            <button className="btn btn-primary" onClick={() => {
              const phaseName = L.checklist.phases[phase];
              const sectorName = L.checklist.sectors[sector];
              const activePresets = lang === "en" ? CHECKLIST_PRESETS_EN : CHECKLIST_PRESETS;
              const preset = activePresets[L.checklist.phases[phase]]?.[L.checklist.sectors[sector]];
              if (preset) {
                setClResult(preset);
              } else {
                // fallback to API if no preset found
                setClLoading(true);
                setClResult("");
                callClaude(buildChecklistPrompt(lang, phaseName, sectorName), buildSystemPrompt(lang, role))
                  .then(r => setClResult(r))
                  .finally(() => setClLoading(false));
              }
            }} disabled={clLoading}>{clLoading ? L.checklist.generating : L.checklist.generate}</button>
            {clLoading && <span className="muted pulse">{L.checklist.generating}</span>}
            {resultCard(clResult)}
          </div>
        )}

        {activeTab === 3 && (
          <div className="surface card" style={{ width: "100%", padding: "1rem", display: "grid", gap: "1rem" }}>
            <div><div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{L.report.title}</div><div className="muted">{L.report.subtitle}</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".75rem" }}>
              {[{ key: "institution", label: L.report.institution }, { key: "year", label: L.report.year }].map(({ key, label }) => <div key={key}><div className="muted" style={{ fontWeight: 500 }}>{label}</div><input value={rpForm[key]} onChange={e => setRpForm(f => ({ ...f, [key]: e.target.value }))} /></div>)}
            </div>
            <div><div className="muted" style={{ fontWeight: 500 }}>{L.report.sector}</div><select value={rpForm.sector} onChange={e => setRpForm(f => ({ ...f, sector: e.target.value }))}>{L.checklist.sectors.map((s, i) => <option key={i} value={s}>{s}</option>)}</select></div>
            <div><div className="muted" style={{ fontWeight: 500 }}>{L.report.context}</div><textarea value={rpForm.context} onChange={e => setRpForm(f => ({ ...f, context: e.target.value }))} placeholder={L.report.contextPlaceholder} style={{ minHeight: 96 }} /></div>
            <button className="btn btn-primary" onClick={async () => { setRpLoading(true); setRpResult(""); const r = await callClaude(buildReportPrompt(lang, rpForm.institution, rpForm.year, rpForm.sector || L.checklist.sectors[0], rpForm.context), buildSystemPrompt(lang, role)); setRpResult(r); setRpLoading(false); }} disabled={rpLoading || !rpForm.institution || !rpForm.year}>{rpLoading ? L.report.generating : L.report.generate}</button>
            {rpLoading && <span className="muted pulse">{L.report.generating}</span>}
            {resultCard(rpResult)}
          </div>
        )}

        <div className="muted" style={{ textAlign: "center", fontSize: ".82rem", marginTop: "1rem" }}>{L.poweredBy}</div>
      </div>
    </div>
  );
}
