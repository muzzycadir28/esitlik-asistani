import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchRelevantChunks(query, language = 'tr') {
  try {
    // Create embedding for the query
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    // Search Supabase for similar chunks
    const { data, error } = await supabase.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_count: 4,
      filter_language: language === 'tr' ? 'TR' : 'EN',
    });

    if (error || !data?.length) return '';

    // Format chunks as context
    return data
      .map((chunk) => `[Kaynak: ${chunk.title}, Benzerlik: ${Math.round(chunk.similarity * 100)}%]\n${chunk.content}`)
      .join('\n\n---\n\n');
  } catch {
    return '';
  }
}

export async function POST(request) {
  try {
    const { messages, customSystem, lang } = await request.json();
    const trimmedMessages = messages.slice(-6);
    const lastUserMessage = trimmedMessages[trimmedMessages.length - 1]?.content || '';

    // Search relevant chunks from knowledge base
    const relevantContext = await searchRelevantChunks(lastUserMessage, lang || 'tr');

    // Build system prompt with context
    const systemWithContext = [
      {
        type: 'text',
        text: customSystem || '',
        cache_control: { type: 'ephemeral' },
      },
    ];
    if (relevantContext) {
      systemWithContext.push({
        type: 'text',
        text: `## İLGİLİ KAYNAK BİLGİLERİ\nAşağıdaki bilgiler veritabanından bulunmuştur. Cevabında bu kaynaklara öncelik ver:\n\n${relevantContext}`,
        cache_control: { type: 'ephemeral' },
      });
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemWithContext,
      messages: trimmedMessages,
    });

    const text = response.content?.[0]?.text || '';
    return Response.json({ text });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
