const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
function loadModule(file, imports) {
  const exportsObject = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports: exportsObject, require: name => imports[name], Intl, Date, Set, JSON, Math, Number, String, Error });
  return exportsObject;
}
const model = loadModule('src/lib/model.ts', {});
function setup() {
  const files = new Map(); let fail = '';
  const native = {
    documentDirectory: '/docs/',
    readDirectoryAsync: async () => Array.from(files.keys()).map(p => p.slice(6)),
    getInfoAsync: async p => ({ exists: files.has(p) }),
    readAsStringAsync: async p => { if (!files.has(p)) throw new Error('missing'); return files.get(p); },
    writeAsStringAsync: async (p, data) => { if (fail === 'write') throw new Error('disk full'); files.set(p, data); },
    moveAsync: async ({ from, to }) => { if (fail === 'move') throw new Error('interrupted rename'); files.set(to, files.get(from)); files.delete(from); },
    deleteAsync: async p => { if (fail === 'cleanup') throw new Error('cleanup failed'); files.delete(p); },
  };
  const restart = () => loadModule('src/lib/storage.ts', { 'react-native': { Platform: { OS: 'ios' } }, 'expo-file-system/legacy': native, './model': model });
  return { files, restart, setFailure: v => { fail = v; } };
}
test('multiple saves and simulated cold restart restore latest full data', async () => {
  const env = setup(); const store = env.restart(); await store.loadData();
  await store.saveData(model.initialData);
  const next = JSON.parse(JSON.stringify(model.initialData)); next.profile.name = 'Sharon'; next.profile.dark = true;
  next.expenses.push({ id: 'e1', categoryId: 'food', cents: 1250, date: '2026-11-22', note: 'Lunch' });
  await store.saveData(next);
  const restored = await env.restart().loadData();
  assert.equal(restored.profile.name, 'Sharon'); assert.equal(restored.profile.dark, true); assert.equal(restored.expenses[0].cents, 1250);
});
test('failed write or rename preserves previous committed data and permits retry', async () => {
  for (const operation of ['write', 'move']) {
    const env = setup(); const store = env.restart(); await store.loadData(); await store.saveData(model.initialData);
    const next = { ...model.initialData, profile: { ...model.initialData.profile, name: 'Changed' } };
    env.setFailure(operation); await assert.rejects(store.saveData(next));
    assert.equal((await env.restart().loadData()).profile.name, 'My profile');
    env.setFailure(''); await store.saveData(next);
    assert.equal((await env.restart().loadData()).profile.name, 'Changed');
  }
});
test('cleanup failure does not report a committed save as failed', async () => {
  const env = setup(); const store = env.restart(); await store.loadData();
  for (let i = 0; i < 3; i++) await store.saveData(model.initialData);
  env.setFailure('cleanup'); await store.saveData({ ...model.initialData, profile: { ...model.initialData.profile, name: 'Saved' } });
  assert.equal((await env.restart().loadData()).profile.name, 'Saved');
});
test('corrupt committed data raises an error rather than silently resetting', async () => {
  const env = setup(); env.files.set('/docs/expense-tracker-v1-000000000001-corrupt.json', '{bad');
  await assert.rejects(env.restart().loadData());
});
