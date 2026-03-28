import { strict as assert } from 'assert';
import { sanitiseMiddleware } from '../backend/src/middleware/sanitise.js';

function mockReq(body) {
  return { body, path: '/api/chat' };
}
function mockRes() {
  return { status: () => mockRes(), json: () => {} };
}

// Test XSS stripping
const req1 = mockReq({ messages: [{ role: 'user', content: '<script>alert(1)</script>Help' }] });
sanitiseMiddleware(req1, mockRes(), () => {});
assert.ok(!req1.body.messages[0].content.includes('<script>'));
assert.ok(req1.body.messages[0].content.includes('Help'));

// Test JS protocol stripping
const req2 = mockReq({ location: 'javascript:alert(1)' });
sanitiseMiddleware(req2, mockRes(), () => {});
assert.ok(!req2.body.location.includes('javascript:'));

// Test length cap
const req3 = mockReq({ location: 'a'.repeat(3000) });
sanitiseMiddleware(req3, mockRes(), () => {});
assert.equal(req3.body.location.length, 2000);

console.log('✅ All sanitise tests passed');
