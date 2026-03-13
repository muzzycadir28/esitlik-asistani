export default function Placeholder({ title }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "3em", marginBottom: 16 }}>🚧</div>
      <div style={{ fontSize: "1.3em", fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ color: "var(--text-secondary)" }}>Bu bölüm yakında aktif olacak.</div>
    </div>
  );
}
