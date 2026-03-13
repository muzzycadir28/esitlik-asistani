export default function TopNav({ title = "Eşitlik Asistanı", menuItems = [], activeItem, onSelect, lang, setLang, role, setRole }) {
  return (
    <div className="header" style={{ padding: "0.8rem 1.2rem", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center" }}>⚖</div>
        <strong>{title}</strong>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        {menuItems.map((item) => (
          <button key={item} className={`tab ${activeItem === item ? "active" : ""}`} onClick={() => onSelect(item)}>{item}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: ".5rem" }}>
        {role && <button className="btn btn-ghost" onClick={() => setRole(null)}>Rolü Değiştir</button>}
        <button className="btn btn-ghost" onClick={() => setLang(lang === "tr" ? "en" : "tr")}>TR | EN</button>
      </div>
    </div>
  );
}
