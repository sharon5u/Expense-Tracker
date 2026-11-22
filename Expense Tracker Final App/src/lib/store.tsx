import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Data, initialData } from './model';
import { loadData, saveData } from './storage';
type Store = {
    data: Data;
    ready: boolean;
    error: string;
    busy: boolean;
    reload: () => Promise<void>;
    update: (change: (current: Data) => Data) => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: React.PropsWithChildren) {
    const [data, setData] = useState(initialData);
    const current = useRef(initialData);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const lock = useRef(false);
    async function reload() {
        setError('');
        setReady(false);
        try {
            const next = await loadData();
            current.current = next;
            setData(next);
            setReady(true);
        }
        catch {
            setError('Your saved data could not be loaded. It has not been reset. Please retry.');
        }
    }
    useEffect(() => {
        let active = true;
        void loadData().then(next => {
            if (!active) return;
            current.current = next;
            setData(next);
            setReady(true);
        }).catch(() => {
            if (active) setError('Your saved data could not be loaded. It has not been reset. Please retry.');
        });
        return () => { active = false; };
    }, []);
    async function update(change: (current: Data) => Data) {
        if (!ready || lock.current)
            throw new Error('Please wait for the current operation, then try again.');
        lock.current = true;
        setBusy(true);
        try {
            const next = change(current.current);
            try {
                await saveData(next);
            }
            catch {
                throw new Error('Could not save on this device. Your input is still here. Please retry.');
            }
            current.current = next;
            setData(next);
        }
        finally {
            lock.current = false;
            setBusy(false);
        }
    }
    return <Context.Provider value={{ data, ready, error, busy, reload, update }}>{children}</Context.Provider>;
}
export function useStore() { const s = useContext(Context); if (!s)
    throw new Error('Store unavailable'); return s; }
export function useColors() {
    const { data } = useStore();
    return data.profile.dark
        ? { bg: '#191619', card: '#252125', text: '#fff3ed', muted: '#c9b6c0', line: '#493a43', accent: '#efadc6', onAccent: '#37202c', error: '#ffb3ad', blush: '#3d2934', lavender: '#302c43', butter: '#3b3324', mint: '#283a33', peach: '#402e29', sticker: '#f1c779' }
        : { bg: '#fffdfa', card: '#ffffff', text: '#493443', muted: '#796370', line: '#eddee4', accent: '#9b4166', onAccent: '#ffffff', error: '#ae293f', blush: '#fce8ee', lavender: '#eeeafa', butter: '#fff2cf', mint: '#e5f2e9', peach: '#fce8dc', sticker: '#a26717' };
}
