Ran 3 commands
Ran 3 commands

Check page.jsx
bash

cat /home/claude/esitlik-asistani/src/app/page.jsx | head -5 && echo "---" && wc -l /home/claude/esitlik-asistani/src/app/page.jsx
Output

"use client";
import { useState, useRef, useEffect } from "react";


// ─── LANGUAGE STRINGS ────────────────────────────────────────────────────────
---
697 /home/claude/esitlik-asistani/src/app/page.jsx

Check if page.jsx has any KEEDB_DOC references
bash

# page.jsx'i KEEDB_DOC referansı olmadan kontrol et
grep -n "KEEDB_DOC\|keedb-doc" /home/claude/esitlik-asistani/src/app/page.jsx
Output

exit code 1

Get full page.jsx content
bash

cat /home/claude/esitlik-asistani/src/app/page.jsx
Output

"use client";
import { useState, useRef, useEffect } from "react";


// ─── LANGUAGE STRINGS ────────────────────────────────────────────────────────
const LANG = {
  tr: {
    appTitle: "Eşitlik Asistanı",
    appSubtitle: "Kadın Erkek Eşitliğine Duyarlı Bütçeleme Destek Sistemi",
    langToggle: "English",
    tabs: ["Danışman", "Belge Analizi", "Rehber & Kontrol", "Rapor Oluştur"],
    poweredBy: "Claude AI ile güçlendirilmiştir",
    roleSelect: {
      title: "Rolünüzü seçin",
      subtitle: "Size en uygun rehberliği sunabilmek için devam etmeden önce profilinizi belirtin.",
      roles: [
        { id: "official", label: "Kamu Görevlisi", icon: "🏛️", desc: "Bakanlık, merkezi idare çalışanı" },
        { id: "local", label: "Yerel Yönetim", icon: "🏙️", desc: "Belediye, il özel idaresi çalışanı" },
        { id: "academic", label: "Akademisyen", icon: "🎓", desc: "Araştırmacı, öğretim üyesi" },
        { id: "ngo", label: "Sivil Toplum", icon: "🤝", desc: "STK, vakıf, savunuculuk kuruluşu" },
      ],
      confirm: "Devam Et",
    },
    chat: {
      quickTitle: "Hızlı Sorular",
      quick: [
        "KEEDB nedir ve neden önemlidir?",
        "KEEDB için hangi ilk adımları atabiliriz?",
        "Planları ve bütçeleri nasıl duyarlı hale getirebilirim?",
        "Türkiye'den başarılı bir örnek paylaşır mısın?",
      ],
      placeholder: "Sorunuzu yazın… (ör. 'Belediye bütçemizi KEEDB'ye uygun hale getirmek istiyoruz')",
      send: "Gönder",
      thinking: "Yanıt hazırlanıyor…",
      changeRole: "Rolü Değiştir",
    },
    docAnalysis: {
      title: "Belge Analizi",
      subtitle: "Strateji planı, proje taslağı veya bütçe dokümanınızı yükleyin",
      upload: "Dosya seçin veya buraya sürükleyin",
      uploadHint: ".txt dosyaları desteklenir — veya metni aşağıya yapıştırın",
      pasteLabel: "Ya da metni buraya yapıştırın",
      pastePlaceholder: "Analiz edilecek belge metnini buraya yapıştırın…",
      analyze: "KEEDB Analizi Yap",
      analyzing: "Analiz ediliyor…",
    },
    checklist: {
      title: "KEEDB Rehber & Kontrol Listeleri",
      subtitle: "Aşama veya sektör seçerek ilgili kontrol listesini oluşturun",
      phaseLabel: "AŞAMA",
      sectorLabel: "SEKTÖR",
      phases: ["Politika Tasarımı", "Bütçe Hazırlığı", "Uygulama", "İzleme & Değerlendirme"],
      sectors: ["Genel", "Sağlık", "Eğitim", "Ulaşım", "Tarım", "Sosyal Koruma"],
      generate: "Kontrol Listesi Oluştur",
      generating: "Oluşturuluyor…",
    },
    report: {
      title: "KEEDB Raporu Oluştur",
      subtitle: "Kurumunuz ve bütçe dönemi bilgilerini girerek yapılandırılmış rapor taslağı alın",
      institution: "Kurum / Bakanlık adı",
      year: "Bütçe yılı",
      sector: "Sektör",
      context: "Ek bağlam (opsiyonel)",
      contextPlaceholder: "Mevcut durum, öncelikler, veri kaynakları hakkında bilgi ekleyin…",
      generate: "Rapor Taslağı Oluştur",
      generating: "Oluşturuluyor…",
    },
  },
  en: {
    appTitle: "Equality Assistant",
    appSubtitle: "Gender Responsive Budgeting Advisory System",
    langToggle: "Türkçe",
    tabs: ["Advisor", "Document Analysis", "Guide & Checklist", "Generate Report"],
    poweredBy: "Powered by Claude AI",
    roleSelect: {
      title: "Select your role",
      subtitle: "Please indicate your profile so we can provide the most relevant guidance.",
      roles: [
        { id: "official", label: "Public Official", icon: "🏛️", desc: "Ministry or central government staff" },
        { id: "local", label: "Local Government", icon: "🏙️", desc: "Municipality or provincial administration" },
        { id: "academic", label: "Academic", icon: "🎓", desc: "Researcher or faculty member" },
        { id: "ngo", label: "Civil Society", icon: "🤝", desc: "NGO, foundation or advocacy organization" },
      ],
      confirm: "Continue",
    },
    chat: {
      quickTitle: "Quick Questions",
      quick: [
        "What is GRB and why does it matter?",
        "What are the first steps we can take for GRB?",
        "How can I make plans and budgets gender-responsive?",
        "Can you share a successful example from Turkey?",
      ],
      placeholder: "Type your question… (e.g. 'We want to make our municipal budget GRB-compliant')",
      send: "Send",
      thinking: "Preparing response…",
      changeRole: "Change Role",
    },
    docAnalysis: {
      title: "Document Analysis",
      subtitle: "Upload your strategic plan, project draft or budget document",
      upload: "Choose file or drag here",
      uploadHint: ".txt files supported — or paste text below",
      pasteLabel: "Or paste text here",
      pastePlaceholder: "Paste the document text to be analyzed here…",
      analyze: "Run GRB Analysis",
      analyzing: "Analyzing…",
    },
    checklist: {
      title: "GRB Guide & Checklists",
      subtitle: "Select a phase or sector to generate the relevant checklist",
      phaseLabel: "PHASE",
      sectorLabel: "SECTOR",
      phases: ["Policy Design", "Budget Preparation", "Implementation", "Monitoring & Evaluation"],
      sectors: ["General", "Health", "Education", "Transport", "Agriculture", "Social Protection"],
      generate: "Generate Checklist",
      generating: "Generating…",
    },
    report: {
      title: "Generate GRB Report",
      subtitle: "Enter your institution and budget period details to get a structured report draft",
      institution: "Institution / Ministry name",
      year: "Budget year",
      sector: "Sector",
      context: "Additional context (optional)",
      contextPlaceholder: "Add information about current situation, priorities, data sources…",
      generate: "Generate Report Draft",
      generating: "Generating…",
    },
  },
};

const ROLE_LABELS = {
  tr: { official: "Kamu Görevlisi", local: "Yerel Yönetim", academic: "Akademisyen", ngo: "Sivil Toplum" },
  en: { official: "Public Official", local: "Local Government", academic: "Academic", ngo: "Civil Society" },
};

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────
const buildSystemPrompt = (lang, role) => {
  const rolCtx = {
    tr: {
      official: "Kullanıcı merkezi kamu idaresinde çalışan bir kamu görevlisidir. Bakanlık düzeyinde bütçe süreçleri, performans programları, stratejik planlar ve faaliyet raporları bağlamında öneriler geliştir.",
      local: "Kullanıcı bir belediye veya il özel idaresinde çalışmaktadır. Yerel bütçe süreçleri, meclis kararları, mahalle düzeyinde hizmet planlaması ve yerel eşitlik planları bağlamında yanıt ver.",
      academic: "Kullanıcı bir akademisyen veya araştırmacıdır. Akademik kaynaklar, metodoloji, ders entegrasyonu ve araştırma tasarımı konularında kapsamlı bilgi sun.",
      ngo: "Kullanıcı bir STK veya sivil toplum kuruluşu temsilcisidir. Savunuculuk stratejileri, izleme araçları, paydaş katılımı ve kapasite geliştirme konularına odaklan.",
    },
    en: {
      official: "The user is a public official working in central government. Provide recommendations in the context of ministry-level budget processes, performance programs, strategic plans and activity reports.",
      local: "The user works in a municipality or provincial administration. Respond in the context of local budget processes, council decisions, neighbourhood-level service planning and local equality plans.",
      academic: "The user is an academic or researcher. Provide comprehensive information on academic sources, methodology, course integration and research design.",
      ngo: "The user is a representative of an NGO or civil society organization. Focus on advocacy strategies, monitoring tools, stakeholder engagement and capacity building.",
    },
  };

  if (lang === "tr") return `Sen "Eşitlik Asistanı" adlı, Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) konusunda uzmanlaşmış bir yapay zeka danışmanısın.

## KİMLİĞİN VE MİSYONUN
Temel görevin; yöneticilere, kamu görevlilerine, yerel yönetim çalışanlarına, akademisyenlere ve sivil toplum temsilcilerine KEEDB konusunda bilgi, rehberlik ve pratik öneriler sunmaktır.

## TERMİNOLOJİ KURALLARI
- Türkçe yanıtlarda DAIMA "Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB)" ifadesini kullan.
- "Toplumsal cinsiyet" yerine "kadın erkek eşitliği" ifadesini tercih et.
- Teknik terimleri ilk kullanımda parantez içinde açıkla.

## KULLANICI PROFİLİ
${rolCtx.tr[role] || rolCtx.tr.official}

## GÖREVLERIN
1. **Temel Bilgi:** KEEDB'nin ne olduğunu, neden önemli olduğunu, yasal ve politik çerçeveyi açıkla.
2. **Yol Göster:** Planlama ve bütçeleme süreçlerinde eşitlikçi adımlar için rehberlik et. Şablonlar, kontrol listeleri ve örnekler sun.
3. **Politika Tavsiyeleri:** Kullanıcının bağlamına uygun pratik ve stratejik öneriler geliştir.
4. **Örnekler:** Türkiye'den iyi uygulamalar ve uluslararası literatürden kısa örnekler sun.

## DAVRANIŞ KURALLARI
- Emin olmadığın bilgiyi ASLA uydurma; "Bu konuda güncel veri gerekmektedir" veya "Kurumun resmi belgelerini inceleyiniz" de.
- Siyasi yorum yapma, kanıta dayalı ve tarafsız ol.
- Hem kadınların hem erkeklerin eşitliği bağlamında öneriler geliştir; kapsayıcı bir dil kullan.
- Saygılı, motive edici ve gerektiğinde hafif esprili bir ton benimse.
- Konu dışı sorularda kibar ve espirili şekilde yanıtla, ardından kullanıcıyı KEEDB'ye yönlendir. Örnek: "Güzel bir soru! Ama ben Eşitlik Asistanıyım 😊. İstersen şimdi bütçende eşitlik yolculuğuna geri dönelim."

## YANIT FORMATI
- Önce kısa özet (2-3 cümle), sonra kullanıcı isterse detay.
- Madde işaretleri, tablolar ve kontrol listeleri kullan.
- Önerilerini uygulanabilir adımlar şeklinde ver.
- Belgeye atıf yapıyorsan cevabın sonunda APA 7 formatında kaynakça ekle.

## REFERANS DOKÜMAN
Sana "Kadın Erkek Eşitliğine Duyarlı Planlama ve Bütçeleme Eğitici Rehberi" (UN Women / AB, Mayıs 2024) dokümanı verilmiştir. Bu doküman 10 modülden oluşmakta olup KEEDB'nin kavramsal çerçevesi, uygulama araçları, analiz yöntemleri, istatistikler, izleme ve kurumsallaşma konularını kapsamaktadır. Yanıtlarında ÖNCE bu dokümanı kullan; içeriğe atıf yaparken "Eğitici Rehberi (2024), Modül X" gibi belirt.

## KAYNAK ÖNCELİĞİ
1. Sana verilen KEEDB Eğitici Rehberi (önce bunu kontrol et)
2. Kullanıcının yüklediği belgeler
3. Resmi Türk kaynakları: sp.gov.tr, ilgili bakanlık web siteleri
4. Uluslararası kaynaklar: OECD, UN Women, UNDP, Dünya Bankası, IMF
5. Genel bilgi (yalnızca yukarıdakilerde bulunamazsa)

Kullanıcı link paylaşırsa: "Paylaştığınız bağlantı için teşekkürler. Şu an dış kaynaklı belgeleri doğrudan açamıyorum. Eğer dosyayı buraya yükleyebilirseniz memnuniyetle yardımcı olurum." de.`;

  return `You are "Equality Assistant", an AI advisor specializing in Gender Responsive Budgeting (GRB).

## YOUR IDENTITY AND MISSION
Your core mission is to provide information, guidance and practical recommendations on GRB to policymakers, public officials, local government staff, academics and civil society representatives.

## TERMINOLOGY RULES
- In English responses, ALWAYS use "Gender Responsive Budgeting (GRB)".
- Explain technical terms in parentheses on first use.

## USER PROFILE
${rolCtx.en[role] || rolCtx.en.official}

## YOUR TASKS
1. **Core Knowledge:** Explain what GRB is, why it matters, and its legal and policy framework.
2. **Guidance:** Guide users through equality-focused steps in planning and budgeting. Provide templates, checklists and examples.
3. **Policy Advice:** Develop practical and strategic recommendations tailored to the user's context.
4. **Examples:** Share good practices from Turkey and brief examples from international literature.

## BEHAVIOURAL RULES
- NEVER fabricate uncertain information; say "Current data is needed on this" or "Please consult the institution's official documents."
- Do not make political commentary; be evidence-based and impartial.
- Develop recommendations in the context of equality for both women and men; use inclusive language.
- Adopt a respectful, motivating and occasionally lightly humorous tone.
- For off-topic questions, respond politely and humorously, then redirect to GRB. Example: "Great question! But I'm the Equality Assistant 😊. Shall we get back to your budgeting journey?"

## RESPONSE FORMAT
- Brief summary first (2-3 sentences), then detail if the user requests it.
- Use bullet points, tables and checklists.
- Present recommendations as actionable steps.
- If citing a document, add an APA 7 reference list at the end of your response.

## REFERENCE DOCUMENT
You have been provided with the "Gender Responsive Planning and Budgeting Trainer's Guide" (UN Women / EU, May 2024). This document consists of 10 modules covering GRB conceptual framework, implementation tools, analysis methods, statistics, monitoring and institutionalisation. In your responses, USE THIS DOCUMENT FIRST; when citing content, indicate "Trainer's Guide (2024), Module X".

## SOURCE PRIORITY
1. The GRB Trainer's Guide provided to you (check this first)
2. User-uploaded documents
3. Official Turkish sources: sp.gov.tr, relevant ministry websites
4. International sources: OECD, UN Women, UNDP, World Bank, IMF
5. General knowledge (only if not found in the above)

If the user shares a link: "Thank you for the link. I can't open external documents directly right now. If you can upload the file here, I'd be happy to help."`;
};

const buildDocPrompt = (lang, text) => lang === "tr"
  ? `Aşağıdaki kamu belgesi metnini Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) perspektifinden analiz et.

BELGE:
${text}

## 1. Genel KEEDB Değerlendirmesi
Belgenin mevcut KEEDB seviyesini kısaca değerlendir (Başlangıç / Gelişmekte / İleri).

## 2. Tespit Edilen Sorunlar
Cinsiyet körü ifadeler, eksik veri noktaları ve KEEDB açıklarını listele.

## 3. Güçlü Yanlar
Varsa mevcut olumlu KEEDB unsurlarını belirt.

## 4. Öncelikli Öneriler
En kritik 5 iyileştirme önerisini uygulanabilir adımlar olarak sırala.

## 5. Örnek Yeniden Yazımlar
2-3 somut paragraf/madde için KEEDB uyumlu alternatif ifadeler öner.

Cevabın sonunda kullandığın kaynakları APA 7 formatında listele.`
  : `Analyze the following public document text from a Gender Responsive Budgeting (GRB) perspective.

DOCUMENT:
${text}

## 1. Overall GRB Assessment
Briefly assess the document's current GRB level (Beginner / Developing / Advanced).

## 2. Issues Identified
List gender-blind language, missing data points and GRB gaps.

## 3. Strengths
Note any existing positive GRB elements if present.

## 4. Priority Recommendations
List the 5 most critical improvement recommendations as actionable steps.

## 5. Sample Rewrites
Suggest GRB-compliant alternative language for 2-3 specific paragraphs/items.

Add an APA 7 reference list at the end.`;

const buildChecklistPrompt = (lang, phase, sector) => lang === "tr"
  ? `"${phase}" aşaması ve "${sector}" sektörü için Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) kontrol listesi oluştur.

Her madde için şunları içer:
- ☐ Kontrol sorusu / yapılacak eylem (net ve uygulanabilir)
- Neden önemli olduğuna dair 1 cümle
- Varsa referans kaynak

Maddeleri mantıksal gruplara ayır. Toplam 15-20 madde olsun.
Cevabın sonunda APA 7 kaynakça ekle.`
  : `Generate a Gender Responsive Budgeting (GRB) checklist for the "${phase}" phase and "${sector}" sector.

For each item include:
- ☐ Check question / action to take (clear and actionable)
- 1 sentence on why it matters
- Reference source if applicable

Group items logically. Include 15-20 items total.
Add an APA 7 reference list at the end.`;

const buildReportPrompt = (lang, institution, year, sector, context) => lang === "tr"
  ? `${institution} kurumu için ${year} bütçe dönemi ve "${sector}" sektörüne yönelik Kadın Erkek Eşitliğine Duyarlı Bütçeleme (KEEDB) raporu taslağı oluştur.
Ek bağlam: ${context || "Belirtilmedi"}

# ${institution} — ${year} KEEDB Raporu

## Yönetici Özeti
## 1. Mevcut Durum Analizi
## 2. Kadın Erkek Eşitliği Öncelikleri
## 3. Bütçe Tahsislerine KEEDB Entegrasyonu
## 4. Performans Göstergeleri
## 5. Veri ve İzleme Çerçevesi
## 6. Eylem Planı
## Kaynakça (APA 7)

Her bölümde somut öneriler, örnek göstergeler ve uluslararası iyi uygulamalara atıflar ekle.`
  : `Generate a Gender Responsive Budgeting (GRB) report draft for ${institution}, budget year ${year}, sector: "${sector}".
Additional context: ${context || "Not provided"}

# ${institution} — ${year} GRB Report

## Executive Summary
## 1. Current Situation Analysis
## 2. Gender Equality Priorities
## 3. GRB Integration in Budget Allocations
## 4. Performance Indicators
## 5. Data and Monitoring Framework
## 6. Action Plan
## References (APA 7)

Include concrete recommendations, sample indicators and references to international good practices in each section.`;

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(userContent, systemPrompt, history = [], lang, role) {
  const messages = [
    ...history,
    { role: "user", content: userContent },
  ];
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, lang, role, customSystem: systemPrompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text || "—";
}

// ─── MARKDOWN RENDERER ────────────────────────────────────────────────────────
function MD({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith("# ")) { elements.push(<h1 key={i} style={{ fontSize: "1.35em", fontWeight: 700, color: "#f0a847", margin: "1em 0 0.4em", borderBottom: "1px solid #1e3448", paddingBottom: "0.3em" }}>{l.slice(2)}</h1>); }
    else if (l.startsWith("## ")) { elements.push(<h2 key={i} style={{ fontSize: "1.1em", fontWeight: 700, color: "#e8c87a", margin: "0.9em 0 0.3em" }}>{l.slice(3)}</h2>); }
    else if (l.startsWith("### ")) { elements.push(<h3 key={i} style={{ fontSize: "1em", fontWeight: 600, color: "#d4b870", margin: "0.7em 0 0.25em" }}>{l.slice(4)}</h3>); }
    else if (l.startsWith("- ") || l.startsWith("☐ ") || l.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("☐ ") || lines[i].startsWith("* "))) {
        const raw = lines[i].replace(/^[-*☐] /, "");
        items.push(<li key={i} style={{ margin: "0.3em 0", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: raw.replace(/\*\*(.+?)\*\*/g, "<strong style='color:#f0c060'>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>") }} />);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: "1.4em", margin: "0.4em 0" }}>{items}</ul>);
      continue;
    }
    else if (/^\d+\. /.test(l)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const raw = lines[i].replace(/^\d+\. /, "");
        items.push(<li key={i} style={{ margin: "0.3em 0", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: raw.replace(/\*\*(.+?)\*\*/g, "<strong style='color:#f0c060'>$1</strong>") }} />);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: "1.4em", margin: "0.4em 0" }}>{items}</ol>);
      continue;
    }
    else if (l.trim() === "") { elements.push(<div key={i} style={{ height: "0.5em" }} />); }
    else {
      const html = l.replace(/\*\*(.+?)\*\*/g, "<strong style='color:#f0c060'>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
      elements.push(<p key={i} style={{ lineHeight: 1.7, margin: "0.2em 0" }} dangerouslySetInnerHTML={{ __html: html }} />);
    }
    i++;
  }
  return <div>{elements}</div>;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EsitlikAsistani() {
  const [lang, setLang] = useState("tr");
  const [activeTab, setActiveTab] = useState(0);
  const [role, setRole] = useState(null);
  const L = LANG[lang];

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef(null);

  // Doc
  const [docText, setDocText] = useState("");
  const [docResult, setDocResult] = useState("");
  const [docLoading, setDocLoading] = useState(false);

  // Checklist
  const [phase, setPhase] = useState(0);
  const [sector, setSector] = useState(0);
  const [clResult, setClResult] = useState("");
  const [clLoading, setClLoading] = useState(false);

  // Report
  const [rpForm, setRpForm] = useState({ institution: "", year: String(new Date().getFullYear()), sector: "", context: "" });
  const [rpResult, setRpResult] = useState("");
  const [rpLoading, setRpLoading] = useState(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendChat = async (override) => {
    const text = override ?? chatInput;
    if (!text.trim() || chatLoading) return;
    setChatInput("");
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setChatLoading(true);
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const reply = await callClaude(text, buildSystemPrompt(lang, role), history, lang, role);
    setMessages([...newHistory, { role: "assistant", content: reply }]);
    setChatLoading(false);
  };

  const C = { background: "#0d1b2a", surface: "#0a1520", border: "#1e3448", amber: "#f0a847", muted: "#5070a0", text: "#e8e0d0", dim: "#4a6070" };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:${C.background}}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.background}}::-webkit-scrollbar-thumb{background:#2a3d52;border-radius:3px}
    input,textarea,select{background:${C.background};color:${C.text};border:1px solid #2a3d52;font-family:inherit;outline:none;transition:border .2s}
    input:focus,textarea:focus,select:focus{border-color:${C.amber}}
    input::placeholder,textarea::placeholder{color:${C.dim}}
    option{background:#132230}
    .fade{animation:fadeUp .35s ease}
    @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .pulse{animation:pulse 1.4s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
    .tab:hover{color:${C.amber}}
    .chip:hover{border-color:${C.amber};color:${C.text}}
    .seg:hover{border-color:#3a5d7c;color:#d0c8b8}
    .sel{background:#1a3a5c!important;border-color:${C.amber}!important;color:#f0c060!important}
    .role-card:hover{border-color:${C.amber};transform:translateY(-2px)}
    .role-card.chosen{border-color:${C.amber};background:#132230}
    .btn-primary{background:${C.amber};color:#0d1b2a;border:none;cursor:pointer;font-family:inherit;font-weight:700;transition:all .2s}
    .btn-primary:hover:not(:disabled){background:#f8bf60}
    .btn-primary:disabled{opacity:.45;cursor:not-allowed}
    .btn-ghost{background:#1a3a5c;color:${C.text};border:1px solid #2a4d6c;cursor:pointer;font-family:inherit;transition:all .2s}
    .btn-ghost:hover:not(:disabled){border-color:${C.amber};color:${C.amber}}
    .btn-ghost:disabled{opacity:.45;cursor:not-allowed}
  `;

  // ── Role selection screen ──
  if (!role) return (
    <div style={{ minHeight: "100vh", background: C.background, fontFamily: "'Lora','Georgia',serif", color: C.text, display: "flex", flexDirection: "column" }}>
      <style>{css}</style>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#f0a847,#c06010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>⚖</div>
          <div>
            <div style={{ fontSize: "1.4em", fontWeight: 600, color: "#f0e8d0" }}>{L.appTitle}</div>
            <div style={{ fontSize: "0.72em", color: C.muted, fontFamily: "'DM Mono',monospace", letterSpacing: ".05em" }}>{L.appSubtitle}</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")} style={{ padding: "7px 16px", borderRadius: 6, fontSize: "0.82em", fontFamily: "'DM Mono',monospace" }}>{L.langToggle}</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "1.7em", fontWeight: 600, color: "#f0e8d0", marginBottom: 10 }}>{L.roleSelect.title}</div>
          <div style={{ color: C.muted, fontSize: "0.92em", marginBottom: 36, lineHeight: 1.6 }}>{L.roleSelect.subtitle}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {L.roleSelect.roles.map(r => (
              <div key={r.id} className={`role-card${role === r.id ? " chosen" : ""}`}
                onClick={() => setRole(r.id)}
                style={{ border: `1px solid ${role === r.id ? C.amber : C.border}`, background: role === r.id ? "#132230" : C.surface, borderRadius: 12, padding: "20px 16px", cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                <div style={{ fontSize: "1.8em", marginBottom: 8 }}>{r.icon}</div>
                <div style={{ fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: "0.8em", color: C.muted, lineHeight: 1.5 }}>{r.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {L.roleSelect.roles.map(r => (
              <button key={r.id} className="btn-primary" onClick={() => setRole(r.id)}
                style={{ padding: "12px", borderRadius: 8, fontSize: "0.9em" }}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Main app ──
  return (
    <div style={{ minHeight: "100vh", background: C.background, fontFamily: "'Lora','Georgia',serif", color: C.text }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: "linear-gradient(135deg,#f0a847,#c06010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚖</div>
          <div>
            <div style={{ fontSize: "1.3em", fontWeight: 600, color: "#f0e8d0" }}>{L.appTitle}</div>
            <div style={{ fontSize: "0.68em", color: C.muted, fontFamily: "'DM Mono',monospace", letterSpacing: ".05em" }}>{L.appSubtitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: "0.75em", color: C.muted, fontFamily: "'DM Mono',monospace", background: "#132230", border: `1px solid ${C.border}`, padding: "5px 12px", borderRadius: 20 }}>
            {L.roleSelect.roles.find(r => r.id === role)?.icon} {ROLE_LABELS[lang][role]}
          </div>
          <button className="btn-ghost" onClick={() => setRole(null)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: "0.75em", fontFamily: "'DM Mono',monospace" }}>{L.chat.changeRole}</button>
          <button className="btn-ghost" onClick={() => setLang(l => l === "tr" ? "en" : "tr")} style={{ padding: "5px 12px", borderRadius: 6, fontSize: "0.75em", fontFamily: "'DM Mono',monospace" }}>{L.langToggle}</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 28px", background: C.surface, display: "flex" }}>
        {L.tabs.map((t, i) => (
          <button key={i} className="tab" onClick={() => setActiveTab(i)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "13px 18px", fontSize: "0.88em", color: activeTab === i ? C.amber : "#5a7090", borderBottom: activeTab === i ? `2px solid ${C.amber}` : "2px solid transparent", transition: "all .2s", letterSpacing: ".02em" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>

        {/* TAB 0 – Chat */}
        {activeTab === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Quick questions */}
            <div>
              <div style={{ fontSize: "0.72em", color: C.muted, fontFamily: "'DM Mono',monospace", letterSpacing: ".07em", marginBottom: 10 }}>{L.chat.quickTitle}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {L.chat.quick.map((q, i) => (
                  <button key={i} className="chip" onClick={() => sendChat(q)}
                    style={{ background: "#0a1520", border: `1px solid ${C.border}`, color: "#8aA4bc", borderRadius: 8, padding: "10px 14px", textAlign: "left", fontSize: "0.84em", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.5, transition: "all .2s" }}>
                    <span style={{ color: C.amber, marginRight: 6 }}>›</span>{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ minHeight: 260, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} className="fade" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "assistant" && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f0a847,#c06010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginRight: 9, flexShrink: 0, marginTop: 3 }}>⚖</div>
                  )}
                  <div style={{ maxWidth: "80%", padding: "11px 15px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "#1a3a5c" : C.surface, border: `1px solid ${m.role === "user" ? "#2a4d6c" : C.border}`, fontSize: "0.9em", lineHeight: 1.7 }}>
                    {m.role === "assistant" ? <MD text={m.content} /> : m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f0a847,#c06010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚖</div>
                  <span style={{ color: C.muted, fontStyle: "italic", fontSize: "0.84em" }} className="pulse">{L.chat.thinking}</span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 9 }}>
              <textarea value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                placeholder={L.chat.placeholder}
                style={{ flex: 1, padding: "11px 14px", borderRadius: 10, fontSize: "0.88em", resize: "none", height: 60, lineHeight: 1.5 }} />
              <button className="btn-primary" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}
                style={{ padding: "0 20px", borderRadius: 10, fontSize: "0.88em" }}>
                {L.chat.send}
              </button>
            </div>
          </div>
        )}

        {/* TAB 1 – Doc Analysis */}
        {activeTab === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={{ fontSize: "1.3em", fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>{L.docAnalysis.title}</div>
              <div style={{ color: C.muted, fontSize: "0.82em", fontFamily: "'DM Mono',monospace" }}>{L.docAnalysis.subtitle}</div>
            </div>
            <div style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: "26px 18px", textAlign: "center", cursor: "pointer" }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setDocText(ev.target.result); r.readAsText(f); } }}>
              <div style={{ fontSize: "1.8em", marginBottom: 6 }}>📄</div>
              <div style={{ color: "#5a7090" }}>{L.docAnalysis.upload}</div>
              <div style={{ color: C.dim, fontSize: "0.75em", marginTop: 4, fontFamily: "'DM Mono',monospace" }}>{L.docAnalysis.uploadHint}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75em", color: C.muted, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>{L.docAnalysis.pasteLabel}</div>
              <textarea value={docText} onChange={e => setDocText(e.target.value)} placeholder={L.docAnalysis.pastePlaceholder}
                style={{ width: "100%", height: 150, padding: "11px 14px", borderRadius: 8, fontSize: "0.85em", resize: "vertical", lineHeight: 1.6 }} />
            </div>
            <button className="btn-primary" onClick={async () => { setDocLoading(true); setDocResult(""); const r = await callClaude(buildDocPrompt(lang, docText), buildSystemPrompt(lang, role)); setDocResult(r); setDocLoading(false); }}
              disabled={docLoading || !docText.trim()} style={{ padding: "12px 26px", borderRadius: 8, fontSize: "0.9em", alignSelf: "flex-start" }}>
              {docLoading ? L.docAnalysis.analyzing : L.docAnalysis.analyze}
            </button>
            {docLoading && <span style={{ color: C.muted, fontStyle: "italic", fontSize: "0.84em" }} className="pulse">{L.docAnalysis.analyzing}</span>}
            {docResult && <div className="fade" style={{ background: "#0a1520", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 10, padding: "18px 22px" }}><MD text={docResult} /></div>}
          </div>
        )}

        {/* TAB 2 – Checklist */}
        {activeTab === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={{ fontSize: "1.3em", fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>{L.checklist.title}</div>
              <div style={{ color: C.muted, fontSize: "0.82em", fontFamily: "'DM Mono',monospace" }}>{L.checklist.subtitle}</div>
            </div>
            {[{ label: L.checklist.phaseLabel, items: L.checklist.phases, val: phase, set: setPhase },
              { label: L.checklist.sectorLabel, items: L.checklist.sectors, val: sector, set: setSector }].map(({ label, items, val, set }, gi) => (
              <div key={gi}>
                <div style={{ fontSize: "0.72em", color: C.muted, fontFamily: "'DM Mono',monospace", letterSpacing: ".07em", marginBottom: 8 }}>{label}</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {items.map((it, i) => (
                    <button key={i} className={`seg${val === i ? " sel" : ""}`} onClick={() => set(i)}
                      style={{ background: val === i ? "#1a3a5c" : "#0a1520", border: `1px solid ${val === i ? C.amber : C.border}`, color: val === i ? "#f0c060" : "#6080a0", borderRadius: 7, padding: "8px 14px", fontSize: "0.84em", cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
                      {it}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn-primary" onClick={async () => { setClLoading(true); setClResult(""); const r = await callClaude(buildChecklistPrompt(lang, L.checklist.phases[phase], L.checklist.sectors[sector]), buildSystemPrompt(lang, role)); setClResult(r); setClLoading(false); }}
              disabled={clLoading} style={{ padding: "12px 26px", borderRadius: 8, fontSize: "0.9em", alignSelf: "flex-start" }}>
              {clLoading ? L.checklist.generating : L.checklist.generate}
            </button>
            {clLoading && <span style={{ color: C.muted, fontStyle: "italic", fontSize: "0.84em" }} className="pulse">{L.checklist.generating}</span>}
            {clResult && <div className="fade" style={{ background: "#0a1520", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 10, padding: "18px 22px" }}><MD text={clResult} /></div>}
          </div>
        )}

        {/* TAB 3 – Report */}
        {activeTab === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={{ fontSize: "1.3em", fontWeight: 600, color: "#f0e8d0", marginBottom: 4 }}>{L.report.title}</div>
              <div style={{ color: C.muted, fontSize: "0.82em", fontFamily: "'DM Mono',monospace" }}>{L.report.subtitle}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ key: "institution", label: L.report.institution }, { key: "year", label: L.report.year }].map(({ key, label }) => (
                <div key={key}>
                  <div style={{ fontSize: "0.72em", color: C.muted, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>{label}</div>
                  <input value={rpForm[key]} onChange={e => setRpForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", padding: "9px 13px", borderRadius: 7, fontSize: "0.88em" }} />
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.72em", color: C.muted, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>{L.report.sector}</div>
              <select value={rpForm.sector} onChange={e => setRpForm(f => ({ ...f, sector: e.target.value }))}
                style={{ width: "100%", padding: "9px 13px", borderRadius: 7, fontSize: "0.88em" }}>
                {L.checklist.sectors.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.72em", color: C.muted, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>{L.report.context}</div>
              <textarea value={rpForm.context} onChange={e => setRpForm(f => ({ ...f, context: e.target.value }))} placeholder={L.report.contextPlaceholder}
                style={{ width: "100%", height: 90, padding: "9px 13px", borderRadius: 7, fontSize: "0.88em", resize: "vertical", lineHeight: 1.6 }} />
            </div>
            <button className="btn-primary" onClick={async () => { setRpLoading(true); setRpResult(""); const r = await callClaude(buildReportPrompt(lang, rpForm.institution, rpForm.year, rpForm.sector || L.checklist.sectors[0], rpForm.context), buildSystemPrompt(lang, role)); setRpResult(r); setRpLoading(false); }}
              disabled={rpLoading || !rpForm.institution || !rpForm.year} style={{ padding: "12px 26px", borderRadius: 8, fontSize: "0.9em", alignSelf: "flex-start" }}>
              {rpLoading ? L.report.generating : L.report.generate}
            </button>
            {rpLoading && <span style={{ color: C.muted, fontStyle: "italic", fontSize: "0.84em" }} className="pulse">{L.report.generating}</span>}
            {rpResult && <div className="fade" style={{ background: "#0a1520", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 10, padding: "18px 22px" }}><MD text={rpResult} /></div>}
          </div>
        )}

        <div style={{ marginTop: 44, paddingTop: 18, borderTop: `1px solid #1a2e40`, textAlign: "center", color: "#384c5c", fontSize: "0.7em", fontFamily: "'DM Mono',monospace" }}>{L.poweredBy}</div>
      </div>
    </div>
  );
}
Done
