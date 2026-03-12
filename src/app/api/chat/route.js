import fs from "node:fs";
import path from "node:path";
import { KEEDB_DOC } from "../../../lib/keedb-doc";

const MEMORY_PATH = path.join(process.cwd(), "memory.md");
const MEMORY_RULES = (() => {
  try {
    return fs.readFileSync(MEMORY_PATH, "utf8").trim();
  } catch (error) {
    console.warn("memory.md okunamadı, varsayılan kurallarla devam ediliyor.", error);
    return "";
  }
})();

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
  const memorySection = MEMORY_RULES
    ? `\n\n---\nmemory.md — ASİSTAN KURAL SETİ:\n${MEMORY_RULES}`
    : "";
  const docSection = `\n\n---\nKEEDB EĞİTİCİ REHBERİ (UN Women / AB, Mayıs 2024) — ÖNCELİKLİ REFERANS:\n${KEEDB_DOC}`;

  if (lang === "tr") {
    return `Sen "Eşitlik Asistanı" — KEEDB uzmanı bir yapay zeka danışmanısın.
Kullanıcı profili: ${ctx}
Türkçe yanıtlarda "KEEDB" terimini kullan. Konu dışı sorularda espirili şekilde yönlendir.
Önce memory.md kurallarını uygula, sonra verilen rehber dokümanını kontrol et, ardından genel bilgini kullan. APA 7 kaynakça ekle.${memorySection}${docSection}`;
  }
  return `You are "Equality Assistant" — a GRB expert AI advisor.
User profile: ${ctx}
Use "GRB" in English responses. Redirect off-topic questions humorously.
Apply memory.md rules first, then check the provided guide document, then use general knowledge. Add APA 7 references.${memorySection}${docSection}`;
}

export async function POST(request) {
  try {
    const { messages, lang, role } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set.");
    }

    if (!Array.isArray(messages) || !lang || !role) {
      throw new Error("Request body must include messages, lang, and role fields.");
    }

    const customSystem = buildSystem(lang, role);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 2048,
        system: customSystem,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = Array.isArray(data?.content)
      ? data.content.map((block) => block?.text || "").join("\n")
      : "";

    return Response.json({ text });
  } catch (error) {
    console.error("/api/chat error:", error);
    return Response.json({ error: error?.message || "Bilinmeyen sunucu hatası." }, { status: 500 });
  }
}
                                      
