import { strict as assert } from 'assert';
import {
  extractCategory, extractDanger, extractDispatch,
  extractPhone, extractReport, cleanDisplayText
} from '../frontend/src/utils/parser.js';

// extractCategory
assert.equal(extractCategory('[CATEGORY:FIRE] Help!'), 'FIRE');
assert.equal(extractCategory('[CATEGORY:MEDICAL] chest pain'), 'MEDICAL');
assert.equal(extractCategory('[CATEGORY:CRIME] being followed'), 'CRIME');
assert.equal(extractCategory('no tag here'), null);

// extractDanger
assert.equal(extractDanger('[DANGER:EXTREME]'), 'EXTREME');
assert.equal(extractDanger('[DANGER:HIGH] situation'), 'HIGH');
assert.equal(extractDanger('[DANGER:NORMAL]'), 'NORMAL');
assert.equal(extractDanger('nothing'), null);

// extractDispatch
assert.equal(extractDispatch('TOOL_CALL_DISPATCH: Fire Brigade'), 'Fire Brigade');
assert.equal(extractDispatch('no match'), null);

// extractPhone
assert.equal(extractPhone('TOOL_CALL_PHONE: Ambulance at 108'), 'Ambulance at 108');
assert.equal(extractPhone('nothing'), null);

// extractReport
const sampleReport = `Some text EMERGENCY_REPORT_JSON: {"category":"Medical","severity":"Critical","name":"Riya","location":"Bengaluru","phone":"9876543210","situation":"cardiac arrest","advice_given":"CPR","location_source":"GPS","authorities":"Ambulance"}`;
const report = extractReport(sampleReport);
assert.equal(report.category, 'Medical');
assert.equal(report.name, 'Riya');
assert.equal(report.severity, 'Critical');

// cleanDisplayText
const dirty = '[CATEGORY:FIRE][DANGER:HIGH]Stay low.\nTOOL_CALL_DISPATCH: Fire Brigade\nEMERGENCY_REPORT_JSON: {"x":1}';
const clean = cleanDisplayText(dirty);
assert.ok(!clean.includes('[CATEGORY'));
assert.ok(!clean.includes('TOOL_CALL'));
assert.ok(!clean.includes('EMERGENCY_REPORT'));
assert.ok(clean.includes('Stay low'));

console.log('✅ All parser tests passed');
