const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Sends conversation to backend agent
 * API key never stored in frontend — lives in backend .env
 */
export async function sendMessage({ messages, location, locationSource }) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, location, locationSource }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Server error ${response.status}`);
  }

  return data.reply;
}
