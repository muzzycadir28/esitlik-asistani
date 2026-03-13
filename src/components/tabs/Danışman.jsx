"use client";
import { useRef, useState } from "react";
import { LANG } from "../../lib/lang";
import { QUICK_PRESET_RESPONSES } from "../../lib/presets";
import { callClaude } from "../../lib/api";
import { buildSystemPrompt, MD, ROLE_LABELS } from "./shared";

const normalizeQuickQuestion = (value = "") => value.trim().toLocaleLowerCase("tr-TR");
const getQuickPresetResponse = (lang, question) => QUICK_PRESET_RESPONSES[lang]?.[normalizeQuickQuestion(question)] || null;

export default function Danisman({ lang, role }) {
  const L = LANG[lang];
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeQuick, setActiveQuick] = useState(null);

  const sendChat = async (text, fromQuick = false) => {
    if (!text?.trim() || chatLoading) return;
    setChatLoading(true);
    if (fromQuick) setActiveQuick(text);
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setChatInput("");
    try {
      const preset = getQuickPresetResponse(lang, text);
      const reply = preset || await callClaude(text, buildSystemPrompt(lang, role), history, lang, role);
      setMessages([...history, { role: "assistant", content: reply }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
      <div className="muted" style={{ fontSize: ".86rem", fontWeight: 500 }}>{L.chat.quickTitle}</div>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {L.chat.quick.map((q) => (
          <button key={q} className="chip" style={{ background: activeQuick === q ? "var(--accent)" : "var(--surface)", color: activeQuick === q ? "#fff" : "var(--text)" }} onClick={() => sendChat(q, true)}>{q}</button>
        ))}
      </div>
      <div className="surface" style={{ padding: "1rem", maxHeight: 420, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: ".5rem" }}>
            <div className="surface" style={{ maxWidth: "82%", padding: "0.75rem", background: m.role === "user" ? "color-mix(in oklab,var(--primary) 14%, var(--surface))" : "var(--surface)" }}>
              {m.role === "assistant" ? <MD text={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {chatLoading && <div className="muted pulse">{L.chat.thinking}</div>}
      </div>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={L.chat.placeholder} onKeyDown={(e) => e.key === "Enter" && sendChat(chatInput)} />
        <button className="btn btn-primary" onClick={() => sendChat(chatInput)} disabled={chatLoading || !chatInput.trim()}>{L.chat.send}</button>
      </div>
      <div className="muted">{ROLE_LABELS[lang][role]}</div>
    </div>
  );
}
