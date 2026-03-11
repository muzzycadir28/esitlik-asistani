
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { KEEDB_DOC } from "../../../lib/keedb-doc";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL_CANDIDATES = (process.env.ANTHROPIC_MODELS || "claude-3-5-haiku-latest,claude-3-5-sonnet-latest")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);


const MEMORY_FILE_PATH = path.join(process.cwd(), "memory.md");

function readMemoryRules() {
  try {
    return fs.readFileSync(MEMORY_FILE_PATH, "utf8").trim();
  } catch (error) {
    console.warn("memory.md okunamadı, varsayılan kurallarla devam ediliyor.", error);
    return "";
  }
}

const MEMORY_RULES = readMemoryRules();

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

function getErrorPayload(err) {
  if (!err) return null;
  if (err.error && typeof err.error === "object") return err.error;
  if (typeof err.message !== "string") return null;

  const match = err.message.match(/\{[\s\S]*\}$/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    return parsed?.error || parsed;
  } catch {
    return null;
  }
}

function isRetryableModelError(err) {
  const payload = getErrorPayload(err);
  return payload?.type === "not_found_error" || payload?.type === "invalid_request_error";
}

async function createMessageWithFallback({ messages, system }) {
  let lastError;

  for (const model of MODEL_CANDIDATES) {
    try {
      return await client.messages.create({
        model,
        max_tokens: 2000,
        system,
        messages,
      });
    } catch (error) {
      lastError = error;
      if (!isRetryableModelError(error)) {
        throw error;
      }
    }
  }

  throw lastError || new Error("No Anthropic models configured.");
}

export async function POST(req) {
  try {
    const { messages, lang, role, customSystem } = await req.json();
    const baseSystem = buildSystem(lang || "tr", role || "official");
    const system = customSystem
      ? `${customSystem}\n\n---\nMerkezi Sistem Kuralları:\n${baseSystem}`
      : baseSystem;

    const response = await createMessageWithFallback({ messages, system });

    const text = response.content.map((b) => b.text || "").join("\n");
    return Response.json({ text });
  } catch (err) {
    console.error(err);
    const payload = getErrorPayload(err);
    const safeMessage = payload?.message || err.message || "Bilinmeyen sunucu hatası.";
    return Response.json({ error: safeMessage }, { status: 500 });
  }
}
