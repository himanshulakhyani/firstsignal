import { strict as assert } from 'assert';
import { buildSystemPrompt } from '../backend/src/agent/promptBuilder.js';

// Test with location
const promptWithLoc = buildSystemPrompt('Koramangala, Bengaluru', 'GPS');
assert.ok(promptWithLoc.includes('Koramangala, Bengaluru'));
assert.ok(promptWithLoc.includes('GPS'));
assert.ok(promptWithLoc.includes('Do NOT ask for location'));
assert.ok(promptWithLoc.includes('EMERGENCY_REPORT_JSON'));
assert.ok(promptWithLoc.includes('TOOL_CALL_DISPATCH'));
assert.ok(promptWithLoc.includes('TOOL_CALL_PHONE'));

// Test without location
const promptNoLoc = buildSystemPrompt(null, null);
assert.ok(promptNoLoc.includes('Ask the user for their location'));
assert.ok(!promptNoLoc.includes('Do NOT ask for location'));

// Tone rules present
assert.ok(promptWithLoc.includes('ONLY ONCE'));
assert.ok(promptWithLoc.includes('Never say'));
assert.ok(promptWithLoc.includes('EXTREME'));

console.log('✅ All agent tests passed');
