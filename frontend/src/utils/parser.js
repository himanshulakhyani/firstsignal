/**
 * Extracts [CATEGORY:X] tag from AI response
 */
export function extractCategory(text) {
  const match = text.match(/\[CATEGORY:(FIRE|CRIME|MEDICAL|COMBINATION)\]/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Extracts [DANGER:X] tag from AI response
 */
export function extractDanger(text) {
  const match = text.match(/\[DANGER:(EXTREME|HIGH|NORMAL)\]/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Extracts TOOL_CALL_DISPATCH line
 */
export function extractDispatch(text) {
  const match = text.match(/TOOL_CALL_DISPATCH:(.*)/);
  return match ? match[1].trim() : null;
}

/**
 * Extracts TOOL_CALL_PHONE line
 */
export function extractPhone(text) {
  const match = text.match(/TOOL_CALL_PHONE:(.*)/);
  return match ? match[1].trim() : null;
}

/**
 * Extracts and parses EMERGENCY_REPORT_JSON block
 */
export function extractReport(text) {
  const match = text.match(/EMERGENCY_REPORT_JSON:\s*(\{[\s\S]*?\})/);
  if (!match) return null;
  try {
    const cleaned = match[1]
      .replace(/'/g, '"')
      .replace(/,\s*\}/g, '}')
      .replace(/,\s*\]/g, ']');
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('Report JSON parse failed:', e);
    return null;
  }
}

/**
 * Strips all control tags and blocks from display text
 */
export function cleanDisplayText(text) {
  return text
    .replace(/\[CATEGORY:[A-Z]+\]/gi, '')
    .replace(/\[DANGER:[A-Z]+\]/gi, '')
    .replace(/TOOL_CALL_DISPATCH:.*/g, '')
    .replace(/TOOL_CALL_PHONE:.*/g, '')
    .replace(/EMERGENCY_REPORT_JSON:\s*\{[\s\S]*?\}/g, '')
    .trim();
}

/**
 * Determines stage badge label from message text
 */
export function detectStage(text, hasReported) {
  if (hasReported) return 'DISPATCH';
  const t = text.toLowerCase();
  if (t.includes('help is on the way') || t.includes('dispatch')) return 'DISPATCH';
  if (t.includes('stay low') || t.includes('cpr') || t.includes('crowded') || t.includes('press hard')) return 'ADVISE';
  if (t.includes('your name') || t.includes('where are you') || t.includes('what is your')) return 'GATHER';
  if (t.includes('right here') || t.includes('with you')) return 'CALM';
  return 'LISTEN';
}
