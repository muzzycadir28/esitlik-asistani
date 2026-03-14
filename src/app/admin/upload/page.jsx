"use client";

import { useEffect, useMemo, useState } from "react";
import { extractTextFromPdf } from "@/lib/pdf-text";

const CATEGORIES = ["Rehber", "Rapor", "Araştırma", "Politika", "Diğer"];
const LANGUAGES = ["TR", "EN"];

const initialForm = {
  title: "",
  category: CATEGORIES[0],
  language: LANGUAGES[0],
  year: "",
  source: "",
};

export default function AdminUploadPage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [progressMessages, setProgressMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [listError, setListError] = useState("");

  const canUpload = useMemo(() => {
    return Boolean(file && form.title && form.category && form.language && form.year && form.source);
  }, [file, form]);

  async function fetchDocuments() {
    const response = await fetch("/api/admin/upload", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || "Dokümanlar alınamadı.");
    }

    setDocuments(payload.documents || []);
  }

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    fetchDocuments().catch((error) => {
      setListError(error.message);
    });
  }, [isAuthed]);

  function addProgress(message) {
    setProgressMessages((prev) => [...prev, message]);
  }

  function onDropFile(droppedFile) {
    if (!droppedFile) {
      return;
    }

    if (droppedFile.type !== "application/pdf") {
      addProgress("Lütfen sadece PDF dosyası yükleyin.");
      return;
    }

    setFile(droppedFile);
  }

  async function handleAuthenticate(event) {
    event.preventDefault();

    if (!password.trim()) {
      setAuthError("Lütfen şifre girin.");
      return;
    }

    setAuthError("");

    const formData = new FormData();
    formData.append("mode", "auth");
    formData.append("password", password);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.body) {
      setAuthError("Kimlik doğrulama başarısız.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let hasError = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        const payload = JSON.parse(line);

        if (payload.type === "error") {
          hasError = true;
          setAuthError(payload.message || "Şifre hatalı.");
        }
      }
    }

    if (!hasError) {
      setIsAuthed(true);
      setAuthError("");
    }
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (!file) {
      return;
    }

    setIsUploading(true);
    setProgressMessages([]);
    setListError("");

    addProgress("PDF okunuyor...");

    let extractedText = "";
    try {
      extractedText = await extractTextFromPdf(file);
    } catch {
      addProgress("Hata: PDF metni okunamadı");
      setIsUploading(false);
      return;
    }

    if (!extractedText || extractedText.length < 50) {
      addProgress("Hata: PDF metni okunamadı");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("password", password);
    formData.append("extractedText", extractedText);
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("language", form.language);
    formData.append("year", form.year);
    formData.append("source", form.source);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.body) {
      addProgress("Sunucudan yanıt alınamadı.");
      setIsUploading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        const payload = JSON.parse(line);

        if (payload.type === "progress") {
          addProgress(payload.message);
        }

        if (payload.type === "error") {
          addProgress(`Hata: ${payload.message}`);
        }

        if (payload.type === "done") {
          addProgress(payload.message);
        }
      }
    }

    setIsUploading(false);
    setFile(null);
    setForm(initialForm);

    fetchDocuments().catch((error) => {
      setListError(error.message);
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f5f7ff 0%, #eef2ff 100%)",
        padding: "2rem 1rem",
        color: "#1f2937",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #dbe3ff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(79, 70, 229, 0.12)",
          padding: "1.5rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Admin PDF Yükleme Paneli</h1>
          <p style={{ margin: ".35rem 0 0", color: "#64748b" }}>
            Supabase&apos;e doküman + chunk embedding yükleme aracı.
          </p>
        </div>

        {!isAuthed && (
          <form onSubmit={handleAuthenticate} style={{ display: "grid", gap: ".75rem" }}>
            <label style={{ fontWeight: 600 }}>Admin Şifresi</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Şifre"
              style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                padding: ".7rem .8rem",
                fontSize: ".95rem",
              }}
            />
            {authError && <p style={{ margin: 0, color: "#dc2626" }}>{authError}</p>}
            <button
              type="submit"
              style={{
                width: "fit-content",
                border: 0,
                borderRadius: 10,
                padding: ".65rem 1rem",
                background: "#4f46e5",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Giriş Yap
            </button>
          </form>
        )}

        {isAuthed && (
          <>
            <form onSubmit={handleUpload} style={{ display: "grid", gap: "1rem" }}>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  onDropFile(event.dataTransfer.files?.[0]);
                }}
                style={{
                  border: `2px dashed ${isDragging ? "#4f46e5" : "#94a3b8"}`,
                  borderRadius: 12,
                  padding: "1.2rem",
                  textAlign: "center",
                  background: isDragging ? "#eef2ff" : "#f8fafc",
                }}
              >
                <p style={{ margin: "0 0 .5rem" }}>PDF dosyasını sürükleyin veya seçin</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => onDropFile(event.target.files?.[0])}
                />
                {file && <p style={{ marginTop: ".6rem", color: "#0f172a" }}>Seçilen dosya: {file.name}</p>}
              </div>

              <input
                type="text"
                placeholder="Başlık"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                style={inputStyle}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: ".75rem" }}>
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  style={inputStyle}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  value={form.language}
                  onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
                  style={inputStyle}
                >
                  {LANGUAGES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Yıl"
                  value={form.year}
                  onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Kaynak / Yayıncı"
                  value={form.source}
                  onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={!canUpload || isUploading}
                style={{
                  border: 0,
                  borderRadius: 10,
                  padding: ".75rem 1rem",
                  background: canUpload && !isUploading ? "#4f46e5" : "#a5b4fc",
                  color: "#fff",
                  cursor: canUpload && !isUploading ? "pointer" : "not-allowed",
                }}
              >
                {isUploading ? "Yükleniyor..." : "Yükle"}
              </button>
            </form>

            <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
              <h2 style={{ margin: "0 0 .5rem", fontSize: "1.05rem" }}>Yükleme Durumu</h2>
              <div style={{ display: "grid", gap: ".35rem" }}>
                {progressMessages.length === 0 && (
                  <p style={{ margin: 0, color: "#64748b" }}>Henüz işlem başlatılmadı.</p>
                )}
                {progressMessages.map((message, index) => (
                  <p key={`${message}-${index}`} style={{ margin: 0, color: "#334155" }}>
                    {message}
                  </p>
                ))}
              </div>
            </section>

            <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
              <h2 style={{ margin: "0 0 .5rem", fontSize: "1.05rem" }}>Yüklenen Dokümanlar</h2>
              {listError && <p style={{ color: "#dc2626", marginTop: 0 }}>{listError}</p>}
              <div style={{ display: "grid", gap: ".5rem" }}>
                {documents.length === 0 && <p style={{ margin: 0, color: "#64748b" }}>Henüz kayıt yok.</p>}
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      border: "1px solid #dbe3ff",
                      borderRadius: 10,
                      padding: ".65rem .75rem",
                      background: "#f8faff",
                    }}
                  >
                    <strong>{doc.title}</strong>
                    <div style={{ color: "#475569", fontSize: ".9rem", marginTop: ".2rem" }}>
                      {doc.category} • {doc.year} • {doc.chunk_count} chunk
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  padding: ".7rem .8rem",
  fontSize: ".95rem",
};
