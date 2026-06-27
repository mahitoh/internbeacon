/**
 * Multi-provider AI utility.
 * Tries each configured provider in priority order and returns the first success.
 *
 * Active priority:  Gemini → Groq → Grok (xAI)
 * Disabled:         ANTHROPIC_API_KEY, OPENAI_API_KEY (credits exhausted — re-enable in .env when topped up)
 * Env vars:         GEMINI_API_KEY, GROQ_API_KEY, XAI_API_KEY
 */

// ── Helpers ───────────────────────────────────────────────────────────────────

// Hard ceiling per provider attempt. Large CV-parsing prompts (~8k chars in +
// ~1k tokens out) legitimately take 10-15s on Groq/Gemini, so this must be
// generous enough not to abort a healthy-but-slow call before it returns.
const PROVIDER_TIMEOUT_MS = 30_000;
const FETCH_TIMEOUT_MS    = 28_000;

function withTimeout(promise, ms, label = 'AI call') {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function fetchWithTimeout(url, options, ms = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ── Provider definitions ──────────────────────────────────────────────────────

function buildGeminiProvider() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  // Try models in order — fall to next on overload / not-found
  const GEMINI_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
  ];

  return {
    name: 'gemini',
    call: async (prompt, maxTokens) => {
      let lastError;
      for (const model of GEMINI_MODELS) {
        try {
          const res = await fetchWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
            {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: maxTokens },
              }),
            }
          );
          const data = await res.json();
          if (!res.ok) {
            lastError = new Error(data.error?.message || `HTTP ${res.status}`);
            // On overload or not-found try next model; on auth errors bail immediately
            if (res.status === 401 || res.status === 403) throw lastError;
            continue;
          }
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (!text) { lastError = new Error('Empty response'); continue; }
          if (model !== GEMINI_MODELS[0]) console.log(`[AI] Gemini using fallback model: ${model}`);
          return text;
        } catch (err) {
          if (err === lastError && (err.message.includes('401') || err.message.includes('403'))) throw err;
          lastError = err;
        }
      }
      throw lastError || new Error('All Gemini models failed');
    },
  };
}

function buildGroqProvider() {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return {
    name: 'groq',
    call: async (prompt, maxTokens) => {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model:      'openai/gpt-oss-20b',
          messages:   [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Empty response');
      return text;
    },
  };
}

function buildGrokProvider() {
  const key = process.env.XAI_API_KEY;
  if (!key) return null;
  return {
    name: 'grok',
    call: async (prompt, maxTokens) => {
      const res = await fetchWithTimeout('https://api.x.ai/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          // grok-beta was retired by xAI; grok-2-1212 is the current stable id
          model:      'grok-2-1212',
          messages:   [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Empty response');
      return text;
    },
  };
}

// Build once at module load time
const PROVIDERS = [
  buildGeminiProvider(),
  buildGroqProvider(),
  buildGrokProvider(),
].filter(Boolean);

// ── Public API ────────────────────────────────────────────────────────────────

async function callAI(prompt, maxTokens = 1024) {
  if (!PROVIDERS.length) {
    const err = new Error('No AI providers configured. Set at least one of: GEMINI_API_KEY, GROQ_API_KEY, XAI_API_KEY');
    err.status = 503;
    throw err;
  }

  const failures = [];
  for (const provider of PROVIDERS) {
    try {
      const text = await withTimeout(provider.call(prompt, maxTokens), PROVIDER_TIMEOUT_MS, provider.name);
      if (provider !== PROVIDERS[0]) {
        console.log(`[AI] Used fallback provider: ${provider.name}`);
      }
      return { text, provider: provider.name };
    } catch (err) {
      console.warn(`[AI] ${provider.name} failed: ${err.message}`);
      failures.push(`${provider.name}: ${err.message}`);
    }
  }

  const combined = new Error(`All AI providers failed — ${failures.join(' | ')}`);
  combined.status = 503;
  throw combined;
}

function extractJSON(text, expectArray = false) {
  const start = expectArray ? text.indexOf('[') : text.indexOf('{');
  const end   = expectArray ? text.lastIndexOf(']') : text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in response');
  return JSON.parse(text.slice(start, end + 1));
}

function getActiveProviders() {
  return PROVIDERS.map(p => p.name);
}

module.exports = { callAI, extractJSON, getActiveProviders };
