import { LANG } from "../lib/lang";

export default function RoleSelector({ lang, role, setRole }) {
  const L = LANG[lang];
  return (
    <div className="surface" style={{ padding: "1.5rem" }}>
      <h2>{L.roleSelect.title}</h2>
      <p className="muted">{L.roleSelect.subtitle}</p>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {L.roleSelect.roles.map((r) => (
          <button key={r.id} onClick={() => setRole(r.id)} className="surface" style={{ padding: "1rem", border: role === r.id ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.8rem" }}>{r.icon}</div>
            <div>{r.label}</div>
            <div className="muted">{r.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
