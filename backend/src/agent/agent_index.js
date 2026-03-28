const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const GEMINI_MODEL = 'gemini-2.0-flash';

/**
 * Try Gemini first, fall back to Groq LLaMA if Gemini fails or key missing
 */
export async function runAgent(systemPrompt, messages) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (geminiKey) {
    try {
      return await callGemini(geminiKey, systemPrompt, messages);
    } catch (err) {
      console.warn('Gemini failed, falling back to Groq:', err.message);
    }
  }

  if (!groqKey) throw new Error('No AI API key configured on server');
  return await callGroq(groqKey, systemPrompt, messages);
}

async function callGemini(apiKey, systemPrompt, messages) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // Convert OpenAI format to Gemini format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.65,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Gemini error ${response.status}`);

  return data.candidates[0].content.parts[0].text;
}

async function callGroq(apiKey, systemPrompt, messages) {
  // Sliding window — keep last 20 messages to control token usage
  const recentMessages = messages.slice(-20);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...recentMessages],
      max_tokens: 500,
      temperature: 0.65,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Groq error ${response.status}`);
  return data.choices[0].message.content;
}
