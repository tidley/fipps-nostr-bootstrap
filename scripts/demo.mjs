import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDemo } from '../dist/demoEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const demoDir = path.join(root, 'demo');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function printResult(label, result) {
  console.log(`\n=== ${label} ===`);
  for (const s of result.steps) {
    console.log(`#${s.index} ${s.kind} valid=${s.validationOk} -> ${s.transitionState}${s.reason ? ` (${s.reason})` : ''}`);
  }
  console.log(`final=${result.finalState} success=${result.success}`);
}

const mode = process.argv[2] || 'happy';

if (mode === 'preflight') {
  const req = ['happy-path.json', 'failures.json'];
  const missing = req.filter((f) => !fs.existsSync(path.join(demoDir, f)));
  if (missing.length) {
    console.error('Missing fixtures:', missing.join(', '));
    process.exit(1);
  }
  console.log('Preflight OK: fixtures present');
  process.exit(0);
}

if (mode === 'happy') {
  const happy = readJson(path.join(demoDir, 'happy-path.json'));
  const result = runDemo(happy.events, happy.now);
  printResult('happy-path', result);
  process.exit(result.success ? 0 : 1);
}

if (mode === 'failures') {
  const failures = readJson(path.join(demoDir, 'failures.json'));
  let ok = true;
  for (const scenario of failures.scenarios) {
    const result = runDemo(scenario.events, scenario.now);
    printResult(scenario.id, result);
    if (result.finalState !== scenario.expectFinalState) ok = false;
  }
  process.exit(ok ? 0 : 1);
}

console.error('Usage: node scripts/demo.mjs [preflight|happy|failures]');
process.exit(2);
