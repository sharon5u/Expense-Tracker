import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Data, initialData } from './model';
import { loadData, saveData } from './storage';
type Store = { data: Data; ready: boolean; error: string; busy: boolean; reload: () => Promise<void>; update: (change: (current: Data) => Data) => Promise<void> };
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState(initialData);
  const current = useRef(initialData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function reload() {
    setError(''); setReady(false);
    try { const next = await loadData(); current.current = next; setData(next); setReady(true); }
    catch { setError('Your saved data could not be loaded. It has not been reset. Please retry.'); }
  }
  useEffect(() => { void reload(); }, []);
  async function update(change: (current: Data) => Data) {
    if (!ready || lock.current) throw new Error('Please wait for the current operation, then try again.');
    lock.current = true; setBusy(true);
    try {
      const next = change(current.current);
      try { await saveData(next); } catch { throw new Error('Could not save on this device. Your input is still here. Please retry.'); }
      current.current = next; setData(next);
    } finally { lock.current = false; setBusy(false); }
  }
  return <Context.Provider value={{ data, ready, error, busy, reload, update }}>{children}</Context.Provider>;
}
export function useStore() { const s = useContext(Context); if (!s) throw new Error('Store unavailable'); return s; }
export function useColors() {
  const { data } = useStore();
  return data.profile.dark
    ? { bg: '#101211', card: '#1c201e', text: '#f4f6f2', muted: '#aebbb2', line: '#39443d', accent: '#b9e5cc', onAccent: '#10291d', error: '#ffb3ad' }
    : { bg: '#f8faf7', card: '#ffffff', text: '#172b22', muted: '#63756b', line: '#dbe5dd', accent: '#226345', onAccent: '#ffffff', error: '#aa2424' };
}
