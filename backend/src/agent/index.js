const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

export async function runAgent(systemPrompt, messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured on server');

  // Sliding window — keep last 20 messages to control token usage
  const recentMessages = messages.slice(-20);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...recentMessages],
      max_tokens: 500,
      temperature: 0.65,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Groq error ${response.status}`);
  return data.choices[0].message.content;
}
