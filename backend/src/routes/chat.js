import express from 'express';
import { buildSystemPrompt } from '../agent/promptBuilder.js';
import { runAgent } from '../agent/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { messages, location, locationSource } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }
  if (messages.length > 50) {
    return res.status(400).json({ error: 'Conversation too long' });
  }
  try {
    const systemPrompt = buildSystemPrompt(location, locationSource);
    const reply = await runAgent(systemPrompt, messages);
    res.json({ reply });
  } catch (err) {
    console.error('Agent error:', err.message);
    res.status(502).json({ error: err.message || 'Agent failed' });
  }
});

export default router;
