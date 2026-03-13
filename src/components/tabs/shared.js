import React from "react";

export const ROLE_LABELS = {
  tr: { official: "Kamu Görevlisi", local: "Yerel Yönetim", academic: "Akademisyen", ngo: "Sivil Toplum" },
  en: { official: "Public Official", local: "Local Government", academic: "Academic", ngo: "Civil Society" },
};

export const buildSystemPrompt = (lang, role) => {
  const roleCtx = {
    tr: {
      official: "Merkezi kamu idaresi çalışanı — bakanlık düzeyinde bütçe ve stratejik plan odaklı yanıt ver.",
      local: "Belediye veya il özel idaresi çalışanı — yerel bütçe ve hizmet planlaması odaklı yanıt ver.",
      academic: "Akademisyen veya araştırmacı — metodoloji ve akademik kaynak odaklı yanıt ver.",
      ngo: "STK temsilcisi — savunuculuk, izleme ve kapasite geliştirme odaklı yanıt ver.",
    },
    en: {
      official: "Central government staff — focus on ministry-level budget and strategic planning.",
      local: "Municipality staff — focus on local budget and service planning.",
      academic: "Researcher — focus on methodology and academic sources.",
      ngo: "NGO representative — focus on advocacy, monitoring and capacity building.",
    },
  };

  if (lang === "tr") return `Sen Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) uzmanı bir yapay zeka danışmanısın.
Kullanıcı profili: ${roleCtx.tr[role] || roleCtx.tr.official}
Görevin: KEEDB konusunda bilgi, rehberlik ve pratik öneriler sun.
Kurallar:
- "Kadın erkek eşitliği" ifadesini kullan, "toplumsal cinsiyet" yerine.
- Emin olmadığın bilgiyi uydurma.
- Siyasi yorum yapma, tarafsız ol.
- Konu dışı sorularda kibarca yönlendir: "Ben Eşitlik Asistanıyım 😊 KEEDB konusuna dönelim."
- Önce kısa özet ver, madde işaretleri kullan, uygulanabilir adımlar öner.`;

  return `You are an AI advisor specializing in Gender Responsive Budgeting (GRB).
User profile: ${roleCtx.en[role] || roleCtx.en.official}
Your task: Provide information, guidance and practical recommendations on GRB.
Rules:
- Never fabricate uncertain information.
- Be evidence-based and impartial.
- For off-topic questions, redirect: "I'm the Equality Assistant 😊 Let's get back to GRB."
- Give a brief summary first, use bullet points, suggest actionable steps.`;
};

export function MD({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  const formatInline = (value) => value
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith("# ")) elements.push(<h1 key={i}>{l.slice(2)}</h1>);
    else if (l.startsWith("## ")) elements.push(<h2 key={i}>{l.slice(3)}</h2>);
    else if (l.startsWith("### ")) elements.push(<h3 key={i}>{l.slice(4)}</h3>);
    else if (l.startsWith("- ") || l.startsWith("☐ ") || l.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("☐ ") || lines[i].startsWith("* "))) {
        const raw = lines[i].replace(/^[-*☐] /, "");
        items.push(<li key={i} dangerouslySetInnerHTML={{ __html: formatInline(raw) }} />);
        i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    } else if (/^\d+\. /.test(l)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const raw = lines[i].replace(/^\d+\. /, "");
        items.push(<li key={i} dangerouslySetInnerHTML={{ __html: formatInline(raw) }} />);
        i++;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    } else if (l.trim() === "") elements.push(<div key={i} style={{ height: "0.5rem" }} />);
    else elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: formatInline(l) }} />);
    i++;
  }

  return <div className="md-content">{elements}</div>;
}
