
import Anthropic from "@anthropic-ai/sdk";
import { KEEDB_DOC } from "../../lib/keedb-doc";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROLE_CTX = {
  tr: {
    official: "Kullanıcı merkezi kamu idaresinde çalışan bir kamu görevlisidir. Bakanlık düzeyinde bütçe süreçleri, performans programları ve stratejik planlar bağlamında öneriler geliştir.",
    local:    "Kullanıcı bir belediye veya il özel idaresinde çalışmaktadır. Yerel bütçe süreçleri ve yerel eşitlik planları bağlamında yanıt ver.",
    academic: "Kullanıcı bir akademisyen veya araştırmacıdır. Akademik kaynaklar, metodoloji ve ders entegrasyonu konularında bilgi sun.",
    ngo:      "Kullanıcı bir STK temsilcisidir. Savunuculuk stratejileri, izleme araçları ve kapasite geliştirme konularına odaklan.",
  },
  en: {
    official: "The user is a public official in central government. Provide recommendations on ministry-level budgets, performance programs and strategic plans.",
    local:    "The user works in a municipality. Respond in the context of local budget processes and local equality plans.",
    academic: "The user is an academic. Provide information on sources, methodology and course integration.",
    ngo:      "The user is an NGO representative. Focus on advocacy strategies, monitoring tools and capacity building.",
  },
};

function buildSystem(lang, role) {
  const ctx = ROLE_CTX[lang]?.[role] || ROLE_CTX.tr.official;
  const docSection = `\n\n---\nKEEDB EĞİTİCİ REHBERİ (UN Women / AB, Mayıs 2024) — ÖNCELİKLİ REFERANS:\n${KEEDB_DOC}`;

  if (lang === "tr") {
    return `Sen "Eşitlik Asistanı" — KEEDB uzmanı bir yapay zeka danışmanısın.
Kullanıcı profili: ${ctx}
Türkçe yanıtlarda "KEEDB" terimini kullan. Konu dışı sorularda espirili şekilde yönlendir.
Önce verilen rehber dokümanını kontrol et, sonra genel bilgini kullan. APA 7 kaynakça ekle.${docSection}`;
  }
  return `You are "Equality Assistant" — a GRB expert AI advisor.
User profile: ${ctx}
Use "GRB" in English responses. Redirect off-topic questions humorously.
Check the provided guide document first, then use general knowledge. Add APA 7 references.${docSection}`;
}

export async function POST(req) {
  try {
    const { messages, lang, role, customSystem } = await req.json();
    const system = customSystem
      ? customSystem + `\n\n---\nKEEDB EĞİTİCİ REHBERİ:\n${KEEDB_DOC}`
      : buildSystem(lang || "tr", role || "official");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system,
      messages,
    });

    const text = response.content.map((b) => b.text || "").join("\n");
    return Response.json({ text });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
