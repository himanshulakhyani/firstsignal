import { useState, useCallback } from 'react';
import { sendMessage } from '../services/api.js';
import {
  extractCategory, extractDanger, extractDispatch,
  extractPhone, extractReport, cleanDisplayText, detectStage
} from '../utils/parser.js';

export function useConversation({ location, locationSource }) {
  const [messages, setMessages] = useState([]);       // { role, content, stage? }
  const [history, setHistory] = useState([]);          // raw API history
  const [category, setCategory] = useState(null);
  const [danger, setDanger] = useState('NORMAL');
  const [report, setReport] = useState(null);
  const [toolCalls, setToolCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasReported, setHasReported] = useState(false);

  const processReply = useCallback((raw) => {
    const cat = extractCategory(raw);
    const dng = extractDanger(raw);
    const dispatch = extractDispatch(raw);
    const phone = extractPhone(raw);
    const reportData = extractReport(raw);
    const displayText = cleanDisplayText(raw);

    if (cat) setCategory(cat);
    if (dng) setDanger(dng);

    if (reportData) {
      setHasReported(true);
      setReport(reportData);
    }

    const newToolCalls = [];
    if (dispatch) newToolCalls.push({ type: 'dispatch', text: dispatch });
    if (phone) newToolCalls.push({ type: 'phone', text: phone });
    if (newToolCalls.length > 0) setToolCalls(prev => [...prev, ...newToolCalls]);

    if (displayText) {
      const stage = detectStage(displayText, !!reportData);
      setMessages(prev => [...prev, { role: 'ai', content: displayText, stage }]);
    }
  }, []);

  const send = useCallback(async (userText) => {
    if (!userText.trim() || isLoading) return;
    setError(null);

    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setIsLoading(true);

    try {
      const reply = await sendMessage({
        messages: newHistory,
        location,
        locationSource,
      });
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      processReply(reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [history, isLoading, location, locationSource, processReply]);

  const startSession = useCallback(async () => {
    setMessages([]);
    setHistory([]);
    setCategory(null);
    setDanger('NORMAL');
    setReport(null);
    setToolCalls([]);
    setHasReported(false);
    setError(null);

    const triggerMsg = { role: 'user', content: 'I need emergency help.' };
    setHistory([triggerMsg]);
    setIsLoading(true);

    try {
      const reply = await sendMessage({
        messages: [triggerMsg],
        location,
        locationSource,
      });
      setHistory([triggerMsg, { role: 'assistant', content: reply }]);
      processReply(reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [location, locationSource, processReply]);

  const reset = useCallback(() => {
    setMessages([]);
    setHistory([]);
    setCategory(null);
    setDanger('NORMAL');
    setReport(null);
    setToolCalls([]);
    setHasReported(false);
    setError(null);
  }, []);

  return {
    messages, category, danger, report, toolCalls,
    isLoading, error, hasReported, send, startSession, reset,
  };
}
