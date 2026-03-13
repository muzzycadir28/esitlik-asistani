"use client";
import { useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { LANG } from "../../lib/lang";
import { callClaude } from "../../lib/api";
import { buildSystemPrompt } from "./shared";

const buildDocPrompt = (lang, text) => {
  const truncated = text.slice(0, 3000);
  return lang === "tr"
    ? `Aşağıdaki belgeyi KEEDB perspektifinden analiz et (maks 400 kelime):\n\n${truncated}`
    : `Analyse the following document from a GRB perspective (max 400 words):\n\n${truncated}`;
};

export default function BelgeAnalizi({ lang, role }) {
  const L = LANG[lang];
  const [docText, setDocText] = useState("");
  const [pastedDocText, setPastedDocText] = useState("");
  const [docResult, setDocResult] = useState("");
  const [docLoading, setDocLoading] = useState(false);
  const fileInputRef = useRef(null);

  const analysisText = pastedDocText.trim() || docText.trim();
  const analysisWordCount = useMemo(() => analysisText.split(/\s+/).filter(Boolean).length, [analysisText]);

  const handleDocFile = async (file) => {
    const ext = `.${file.name.split(".").pop().toLowerCase()}`;
    let text = "";
    if (ext === ".txt") text = await file.text();
    if (ext === ".pdf") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => item.str).join(" "));
      }
      text = pages.join("\n");
    }
    if (ext === ".doc" || ext === ".docx") text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
    setDocText(text);
  };

  return <div className="surface" style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
    <input ref={fileInputRef} type="file" hidden onChange={(e) => e.target.files?.[0] && handleDocFile(e.target.files[0])} />
    <button className="btn" onClick={() => fileInputRef.current?.click()}>{L.docAnalysis.upload}</button>
    <textarea value={pastedDocText} onChange={(e) => setPastedDocText(e.target.value)} placeholder={L.docAnalysis.pastePlaceholder} style={{ minHeight: 150 }} />
    <div className="muted">{L.docAnalysis.wordCount}: {analysisWordCount}</div>
    <button className="btn btn-primary" onClick={async () => { setDocLoading(true); setDocResult(await callClaude(buildDocPrompt(lang, analysisText), buildSystemPrompt(lang, role))); setDocLoading(false); }} disabled={docLoading || !analysisText.trim()}>{docLoading ? L.docAnalysis.analyzing : L.docAnalysis.analyze}</button>
    {docResult && <div className="surface" style={{ padding: "1rem", whiteSpace: "pre-wrap" }}>{docResult}</div>}
  </div>;
}
