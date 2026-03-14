import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Disable worker - run in main thread for server-side
pdfjsLib.GlobalWorkerOptions.workerSrc = "";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

function splitIntoChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);

  if (!words.length) {
    return [];
  }

  const chunks = [];
  const step = Math.max(chunkSize - overlap, 1);

  for (let start = 0; start < words.length; start += step) {
    const chunkWords = words.slice(start, start + chunkSize);

    if (!chunkWords.length) {
      break;
    }

    chunks.push(chunkWords.join(" "));

    if (start + chunkSize >= words.length) {
      break;
    }
  }

  return chunks;
}

async function extractPdfText(buffer) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    pages.push(pageText);
  }

  return {
    pageCount: pdf.numPages,
    text: pages.join("\n\n"),
  };
}

function streamingJsonResponse(handler) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      };

      try {
        await handler(send);
      } catch (error) {
        send({
          type: "error",
          message: error.message || "Yükleme sırasında bir hata oluştu.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function GET() {
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, category, year, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  const ids = data.map((doc) => doc.id);
  let chunkCountMap = {};

  if (ids.length) {
    const { data: chunkRows, error: chunkError } = await supabase
      .from("document_chunks")
      .select("document_id")
      .in("document_id", ids);

    if (chunkError) {
      return Response.json({ success: false, error: chunkError.message }, { status: 500 });
    }

    chunkCountMap = chunkRows.reduce((acc, row) => {
      acc[row.document_id] = (acc[row.document_id] || 0) + 1;
      return acc;
    }, {});
  }

  const documents = data.map((doc) => ({
    ...doc,
    chunk_count: chunkCountMap[doc.id] || 0,
  }));

  return Response.json({ success: true, documents });
}

export async function POST(request) {
  return streamingJsonResponse(async (send) => {
    const formData = await request.formData();

    const mode = formData.get("mode")?.toString();
    const password = formData.get("password");
    if (password !== process.env.ADMIN_PASSWORD) {
      send({ type: "error", message: "Admin şifresi hatalı." });
      return;
    }

    if (mode === "auth") {
      send({ type: "done", success: true, message: "Kimlik doğrulandı." });
      return;
    }

    const file = formData.get("file");
    const title = formData.get("title")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const language = formData.get("language")?.toString().trim();
    const year = formData.get("year")?.toString().trim();
    const source = formData.get("source")?.toString().trim();

    if (!file || !(file instanceof File)) {
      send({ type: "error", message: "PDF dosyası bulunamadı." });
      return;
    }

    if (!title || !category || !language || !year || !source) {
      send({ type: "error", message: "Lütfen tüm metadata alanlarını doldurun." });
      return;
    }

    send({ type: "progress", message: "PDF okunuyor..." });

    const fileBuffer = await file.arrayBuffer();
    const { pageCount, text } = await extractPdfText(fileBuffer);

    const chunks = splitIntoChunks(text);
    send({
      type: "progress",
      message: `${pageCount} sayfa bulundu, parçalara bölünüyor...`,
      pageCount,
      chunkCount: chunks.length,
    });

    if (!chunks.length) {
      send({ type: "error", message: "PDF içinden metin çıkarılamadı." });
      return;
    }

    const embeddings = [];

    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      send({
        type: "progress",
        message: `Embedding oluşturuluyor... (${i + 1}/${chunks.length} chunk)`,
        current: i + 1,
        total: chunks.length,
      });

      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });

      embeddings.push(embeddingRes.data[0].embedding);
    }

    send({ type: "progress", message: "Supabase'e kaydediliyor..." });

    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .insert({
        title,
        category,
        language,
        year,
        source,
        file_name: file.name,
        page_count: pageCount,
      })
      .select("id")
      .single();

    if (documentError) {
      send({ type: "error", message: documentError.message });
      return;
    }

    const rows = chunks.map((chunk, index) => ({
      document_id: documentData.id,
      chunk_index: index,
      content: chunk,
      embedding: embeddings[index],
    }));

    const { error: chunksError } = await supabase.from("document_chunks").insert(rows);

    if (chunksError) {
      send({ type: "error", message: chunksError.message });
      return;
    }

    send({
      type: "done",
      success: true,
      chunks: chunks.length,
      message: `Tamamlandı! ${chunks.length} chunk yüklendi.`,
    });
  });
}
