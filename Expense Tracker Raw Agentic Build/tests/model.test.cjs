const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const code = ts.transpileModule(fs.readFileSync('src/lib/model.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exportsObject = {};
vm.runInNewContext(code, { exports: exportsObject, Intl, Date, Set, JSON, Math, Number, String, Error });
const m = exportsObject;
test('amounts are exact cents; invalid and excessive amounts are rejected', () => {
  assert.equal(m.amountCents('12.50'), 1250); assert.equal(m.amountCents('0.01'), 1);
  assert.equal(m.amountCents('001.2'), 120);
  for (const value of ['', '0', '-1', 'abc', '1.234', 'NaN', 'Infinity', '1e3', '10000000', '.']) assert.throws(() => m.amountCents(value), undefined, value);
});
test('dates handle leap years and reject impossible dates', () => {
  assert.equal(m.validDate('2024-02-29'), true); assert.equal(m.validDate('2026-02-29'), false);
  assert.equal(m.validDate('2026-04-31'), false); assert.equal(m.validDate('2026-13-01'), false);
});
test('month navigation crosses years and chart includes zero-spending months', () => {
  assert.equal(m.shiftMonth('2026-12', 1), '2027-01'); assert.equal(m.shiftMonth('2026-01', -1), '2025-12');
  assert.equal(JSON.stringify(m.monthsBetween('2026-11', '2027-02')), JSON.stringify(['2026-11', '2026-12', '2027-01', '2027-02']));
  assert.equal(m.total([]), 0); assert.equal(m.total([{ cents: 10 }, { cents: 20 }]), 30);
  assert.throws(() => m.monthsBetween('2026-12', '2026-01')); assert.throws(() => m.monthsBetween('bad', '2026-01'));
});
test('saved data rejects corruption and preserves valid records', () => {
  assert.equal(m.parseData(JSON.stringify(m.initialData)).categories.length, 6);
  assert.throws(() => m.parseData('{bad')); assert.throws(() => m.parseData('{}'));
  const data = JSON.parse(JSON.stringify(m.initialData));
  data.expenses = [{ id: '1', categoryId: 'missing', cents: 100, date: '2026-11-22', note: '' }];
  assert.throws(() => m.parseData(JSON.stringify(data)));
  data.expenses[0].categoryId = 'food'; assert.equal(m.parseData(JSON.stringify(data)).expenses[0].cents, 100);
  data.expenses.push(data.expenses[0]); assert.throws(() => m.parseData(JSON.stringify(data)));
});
