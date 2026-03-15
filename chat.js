import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';

const K2_MODEL   = 'MBZUAI-IFM/K2-Think-v2';
const K2_API_URL = 'https://api.k2think.ai/v1/chat/completions';
const SERPER_API_URL = 'https://google.serper.dev/search';

export const chatRoutes = new Hono().basePath('/chat');

// Enable CORS for your Vercel domain
chatRoutes.use('*', cors({
  origin: 'https://stremini-chatbot.vercel.app',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// ================= SYSTEM PROMPT =================
// ... (the rest of your code stays the same)

// ================= SYSTEM PROMPT =================
function getSystemPrompt() {
  const now = new Date();
  return `You are Stremini, an advanced AI assistant by Stremini AI.
Today's date is ${now.toDateString()}.

You MUST follow these output format rules on every response.

── COMPARISONS (X vs Y, difference between, which is better) ──
Always use a markdown table:
| Aspect | [A] | [B] |
|--------|-----|-----|
| ...    | ... | ... |
End with: **Summary:** one sentence verdict.

── STEP-BY-STEP (how to, tutorial, setup, install, deploy) ──
Use this exact format:
1. **Step title** — explanation of what to do and why.
2. **Step title** — explanation.
(code blocks inline when needed)

── LISTS (top N, best, recommend, give me examples) ──
Use this exact format:
1. **Item name** — one line description.
2. **Item name** — one line description.

── SCIENCE / MATH / PHYSICS explanations ──
Use ## heading for every concept. Show formula first, then explain:
## Concept Name
Formula: \(formula here\)
Explanation in 2-3 sentences.

── REPORTS / ANALYSIS / RESEARCH ──
Use this structure with ## headings:
## Executive Summary
## Key Findings
## Details
## Conclusion

── CODE ──
Always wrap in fenced blocks with language tag.
Briefly explain before the block. Add usage notes after.

── DIAGRAMS (when asked to visualize, diagram, draw, chart) ──
Respond with a Mermaid diagram inside a fenced block:
\`\`\`mermaid
graph TD / sequenceDiagram / pie / gantt / etc.
\`\`\`
Then explain it in 2-3 sentences.

── SHORT / CONVERSATIONAL ──
Plain prose. No lists or headers needed.

── GLOBAL RULES ──
- Never use plain bullets for comparisons. Always use a table.
- Always bold key terms with **term**.
- Never write walls of unbroken text. Always use structure.
- Use \(formula\) for inline math, \[formula\] for block math.
- No filler phrases. Be direct and concise.
- Max section length: 5 sentences before a new heading.`;
}

function getFormatHint(q) {
  const t = q.toLowerCase();
  if (/\bvs\.?|versus|compare|difference between|which is better|pros and cons\b/.test(t))
    return '\n\n[INSTRUCTION: Use a markdown comparison table. End with a bold Summary line.]';
  if (/\bhow to|how do i|step by step|tutorial|guide|setup|install|configure|deploy\b/.test(t))
    return '\n\n[INSTRUCTION: Use numbered steps with bold titles. Include code blocks where relevant.]';
  if (/\btop \d+|best \d+|list|recommend|suggest|give me examples|name \d+\b/.test(t))
    return '\n\n[INSTRUCTION: Use a numbered list. Bold each item name. One line description per item.]';
  if (/\bdiagram|visualize|chart|draw|graph|flowchart|architecture|flow\b/.test(t))
    return '\n\n[INSTRUCTION: Respond with a Mermaid diagram in a fenced code block. Then explain it.]';
  if (/\breport|analysis|research|analyze|study|breakdown|overview\b/.test(t))
    return '\n\n[INSTRUCTION: Structure with ## headings: Executive Summary, Key Findings, Details, Conclusion.]';
  if (/\bwhat is|explain|describe|how does|elaborate|tell me about\b/.test(t))
    return '\n\n[INSTRUCTION: Use ## headings for each concept. Bold all key terms. Max 4 sentences per section.]';
  if (/\bmath|formula|equation|calculate|compute|solve|physics|chemistry\b/.test(t))
    return '\n\n[INSTRUCTION: Show each formula using \\(...\\) notation. Use ## headings per concept.]';
  return '';
}

// ================= SECURITY =================
function sanitizeInput(input) {
  return input ? input.trim().slice(0, 4000) : '';
}

function containsPromptInjection(input) {
  const patterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
    /\bsystem\s*:/i,
    /reveal\s+(hidden|system|reasoning)/i
  ];
  return patterns.some(p => p.test(input));
}

// ================= CLEAN OUTPUT =================
function cleanOutput(text) {
  if (!text) return '';
  if (text.includes('</think>')) {
    const parts = text.split('</think>');
    text = parts[parts.length - 1].trim();
  } else if (text.includes('<think>')) {
    // Unclosed think block — strip everything from <think> onwards
    const idx = text.indexOf('<think>');
    text = text.slice(0, idx).trim();
  }
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/Thought:[\s\S]*?(Answer:|Response:)/i, '')
    .trim();
}

// ================= SEARCH =================
function shouldSearch(input) {
  if (!input) return false;
  const hardTriggers = [
    /\b(today'?s?|right now|currently|live)\b.*\b(price|weather|score|news|result|winner|match)\b/i,
    /\b(latest|breaking|recent)\s+(news|update|result|score)\b/i,
    /\bstock\s+price\b/i,
    /\bweather\s+(in|for|at)\b/i,
    /\b(who\s+won|final\s+score)\b/i,
    /\b(current|live)\s+(standings?|leaderboard)\b/i,
    /\brelease\s+date\s+of\b/i,
  ];
  return hardTriggers.some(r => r.test(input));
}

async function performWebSearch(query, env) {
  if (!env?.SERPER_API_KEY) return null;
  try {
    const res = await fetch(SERPER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': env.SERPER_API_KEY },
      body: JSON.stringify({ q: query, num: 4 })
    });
    const data = await res.json();
    if (!data.organic) return null;
    return data.organic.slice(0, 4);
  } catch {
    return null;
  }
}

// ================= MESSAGE BUILDER =================
function buildMessages(history, userMessage, searchResults) {
  const messages = [{ role: 'system', content: getSystemPrompt() }];

  if (Array.isArray(history)) {
    const cleanHistory = history
      .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
      .slice(-10);
    messages.push(...cleanHistory);
  }

  if (searchResults) {
    const context = searchResults
      .map((r, i) => `[${i + 1}] ${r.title}: ${r.snippet} (${r.link})`)
      .join('\n');
    messages.push({
      role: 'user',
      content: `Search results:\n${context}\n\nQuestion: ${userMessage}\n\nAnswer using the search results above. Be concise and accurate.`
    });
  } else {
    messages.push({ role: 'user', content: userMessage + getFormatHint(userMessage) });
  }

  return messages;
}

// ================= K2 CALLER =================
// FIX: max_tokens raised to 8000 — K2-Think-v2 has long <think> blocks that
//      were exhausting the 3000/3500 limit before writing the actual answer.
async function callK2(messages, env, maxTokens = 8000) {
  const response = await fetch(K2_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.K2_API_KEY}`
    },
    body: JSON.stringify({
      model: K2_MODEL,
      messages,
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';
  return cleanOutput(raw);
}

// ================= DOCUMENT HELPERS =================
const MAX_CHARS_PER_CHUNK = 8000;

function chunkText(text) {
  const chunks = [];
  const paragraphs = text.split(/\n{2,}/);
  let current = '';

  for (const para of paragraphs) {
    if ((current + para).length > MAX_CHARS_PER_CHUNK) {
      if (current.trim()) chunks.push(current.trim());
      if (para.length > MAX_CHARS_PER_CHUNK) {
        let start = 0;
        while (start < para.length) {
          chunks.push(para.slice(start, start + MAX_CHARS_PER_CHUNK));
          start += MAX_CHARS_PER_CHUNK;
        }
        current = '';
      } else {
        current = para + '\n\n';
      }
    } else {
      current += para + '\n\n';
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.slice(0, MAX_CHARS_PER_CHUNK)];
}

// ================= /message ROUTE =================
chatRoutes.post('/message', async (c) => {
  try {
    const { message, history } = await c.req.json();
    const userMessage = sanitizeInput(message);

    if (!userMessage) return c.json({ error: 'Empty message.' }, 400);
    if (containsPromptInjection(userMessage)) return c.json({ error: 'Suspicious input detected.' }, 400);

    let searchResults = null;
    if (shouldSearch(userMessage)) searchResults = await performWebSearch(userMessage, c.env);

    const messages = buildMessages(history, userMessage, searchResults);
    const answer = await callK2(messages, c.env, 8000);

    if (!answer) return c.json({ error: 'No response from model.' }, 502);
    return c.json({ response: answer });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ================= /document ROUTE =================
chatRoutes.post('/document', async (c) => {
  try {
    const body = await c.req.json();
    const { documentText, question } = body;

    if (!documentText || !question) {
      return c.json({ error: 'documentText and question are required.' }, 400);
    }

    const sanitizedQuestion = sanitizeInput(question);
    if (containsPromptInjection(sanitizedQuestion)) {
      return c.json({ error: 'Suspicious input detected.' }, 400);
    }

    const docText = documentText.slice(0, 600000).trim();
    if (docText.length < 10) {
      return c.json({ error: 'Document text appears to be empty.' }, 400);
    }

    const chunks = chunkText(docText);

    if (chunks.length === 1) {
      const answer = await callK2([
        {
          role: 'system',
          content: 'You are an advanced document analysis assistant. Use the provided document text as your primary source, but combine it with your own broader knowledge to give a thorough, insightful answer. CRITICAL: Do not repeat yourself.'
        },
        {
          role: 'user',
          content: `Document Text:\n\n${chunks[0]}\n\nQuestion: ${sanitizedQuestion}\n\nAnswer:`
        }
      ], c.env, 8000);

      return c.json({ response: answer || 'Failed to generate a response.' });
    }

    const chunkAnswers = [];
    const extractFromChunk = async (chunk, index) => {
      const messages = [
        {
          role: 'system',
          content: `You are an information extraction assistant. Read the following portion of a document. Extract ANY facts, concepts, or context related to the user's question.
CRITICAL: Reply with EXACTLY the word "NOT_RELEVANT" if this chunk has nothing to do with the question.`
        },
        {
          role: 'user',
          content: `Document portion (${index + 1} of ${chunks.length}):\n\n${chunk}\n\nQuestion: ${sanitizedQuestion}\n\nExtracted relevant content:`
        }
      ];
      return await callK2(messages, c.env, 2000);
    };

    const batchSize = 4;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const results = await Promise.all(batch.map((ch, j) => extractFromChunk(ch, i + j)));
      for (const r of results) {
        if (r && !r.includes('NOT_RELEVANT') && r.trim().length > 8) {
          chunkAnswers.push(r.trim());
        }
      }
    }

    if (chunkAnswers.length === 0) {
      const fallbackAnswer = await callK2([
        {
          role: 'system',
          content: 'The document did not contain the exact answer. Acknowledge this briefly, then answer using your own general knowledge.'
        },
        { role: 'user', content: `Question: ${sanitizedQuestion}` }
      ], c.env, 8000);
      return c.json({ response: fallbackAnswer });
    }

    const merged = await callK2([
      {
        role: 'system',
        content: `You are an expert document assistant. Use the extracted facts as your foundation and apply your intelligence to answer comprehensively.
RULES:
- Answer naturally. Do not say "Based on the chunks" or "The document says".
- Fill gaps with your expertise.
- CRITICAL: Do not repeat phrases or loop.`
      },
      {
        role: 'user',
        content: `Extracted Facts:\n\n${chunkAnswers.join('\n\n')}\n\nQuestion: ${sanitizedQuestion}\n\nFinal Answer:`
      }
    ], c.env, 8000);

    return c.json({ response: merged || 'Failed to synthesize final answer.' });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ================= /stream ROUTE =================
// FIX SUMMARY:
// 1. max_tokens raised to 8000 — was exhausting before </think> closed
// 2. If model never exits <think> (token limit hit mid-reasoning),
//    fall back to a non-streaming callK2 call and send that as a single SSE token
// 3. Fixed SSE line parsing — buffer incomplete lines across chunks
// 4. [DONE] is now always sent even on the fallback path
chatRoutes.post('/stream', async (c) => {
  try {
    const { message, history } = await c.req.json();
    const userMessage = sanitizeInput(message);

    if (!userMessage) return c.json({ error: 'Empty message.' }, 400);
    if (containsPromptInjection(userMessage)) return c.json({ error: 'Suspicious input detected.' }, 400);

    let searchResults = null;
    if (shouldSearch(userMessage)) searchResults = await performWebSearch(userMessage, c.env);

    const messages = buildMessages(history, userMessage, searchResults);

    const k2Response = await fetch(K2_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${c.env.K2_API_KEY}`
      },
      body: JSON.stringify({
        model: K2_MODEL,
        messages,
        temperature: 0.5,
        top_p: 0.9,
        max_tokens: 8000,   // FIX: was 3500 — not enough for K2 think blocks
        stream: true
      })
    });

    if (!k2Response.ok) {
      const err = await k2Response.text();
      return c.json({ error: err }, k2Response.status);
    }

    return streamSSE(c, async (stream) => {
      const reader  = k2Response.body.getReader();
      const decoder = new TextDecoder();

      let lineBuf      = '';   // FIX: buffer for incomplete SSE lines across chunks
      let thinkBuf     = '';
      let pastThink    = false;
      const THINK_LIMIT = 20000;  // raised from 15000

      const sendToken = async (token) => {
        if (token) await stream.writeSSE({ data: JSON.stringify({ token }) });
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // FIX: append to lineBuf and split on newlines to handle chunk boundaries
          lineBuf += decoder.decode(value, { stream: true });
          const lines = lineBuf.split('\n');
          lineBuf = lines.pop(); // keep the last (potentially incomplete) line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') continue;

            let parsed;
            try { parsed = JSON.parse(data); } catch { continue; }

            const token = parsed.choices?.[0]?.delta?.content;
            if (token == null) continue;

            if (pastThink) {
              await sendToken(token);
            } else {
              thinkBuf += token;

              // Safety: if buffer is huge, trim keeping tail in case </think> is split
              if (thinkBuf.length > THINK_LIMIT) {
                thinkBuf = thinkBuf.slice(-500);
              }

              if (thinkBuf.includes('</think>')) {
                const parts = thinkBuf.split('</think>');
                const realAnswer = parts[parts.length - 1];
                pastThink = true;
                thinkBuf  = '';
                await sendToken(realAnswer);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // FIX: If we never exited <think>, model ran out of tokens mid-reasoning.
      // Fall back to a non-streaming call with a higher limit to get an answer.
      if (!pastThink) {
        // Check for stray </think> in whatever's buffered
        if (thinkBuf.includes('</think>')) {
          const parts = thinkBuf.split('</think>');
          const tail  = parts[parts.length - 1].trim();
          if (tail) await sendToken(tail);
        } else {
          // True fallback: re-call without streaming at higher token limit
          try {
            const fallback = await callK2(messages, c.env, 12000);
            if (fallback && fallback.trim()) {
              await sendToken(fallback);
            }
          } catch {
            // If fallback also fails, send a graceful error token
            await sendToken('Sorry, the model did not produce a response. Please try again.');
          }
        }
      }

      await stream.writeSSE({ data: '[DONE]' });
    });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ================= HEALTH =================
chatRoutes.get('/health', (c) =>
  c.json({ status: 'ok', model: K2_MODEL })
);

export default chatRoutes;
