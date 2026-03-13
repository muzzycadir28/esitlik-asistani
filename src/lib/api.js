export async function callClaude(userContent, systemPrompt, history = [], lang, role) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const messages = [{ role: "user", content: userContent }];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, lang, role, customSystem: systemPrompt }),
      signal: controller.signal,
    });

    const rawBody = await res.text();
    let data = null;

    if (rawBody?.trim()) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        const sseChunks = rawBody
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace(/^data:\s*/, ""))
          .filter((line) => line && line !== "[DONE]");

        if (sseChunks.length) {
          const sseText = sseChunks
            .map((chunk) => {
              try {
                const parsed = JSON.parse(chunk);
                return parsed?.text || parsed?.delta || "";
              } catch {
                return "";
              }
            })
            .join("")
            .trim();

          if (sseText) return sseText;
        }

        throw new Error(
          lang === "tr"
            ? "Sunucu yanıtı okunamadı. Lütfen tekrar deneyin."
            : "Could not read the server response. Please try again."
        );
      }
    }

    if (!res.ok) {
      throw new Error(data?.error || (lang === "tr" ? "Sunucu hatası oluştu." : "A server error occurred."));
    }

    if (!data) {
      throw new Error(lang === "tr" ? "Sunucudan boş yanıt alındı. Lütfen tekrar deneyin." : "Received an empty response from the server. Please try again.");
    }

    if (data.error) throw new Error(data.error);
    return data.text || "—";
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Yanıt zaman aşımına uğradı. Lütfen tekrar deneyin.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
