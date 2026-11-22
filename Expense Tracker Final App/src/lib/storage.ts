import { Platform } from 'react-native';
import * as FS from 'expo-file-system/legacy';
import { Data, id, initialData, parseData } from './model';
const key = 'expense-tracker-v1';
let revision = 0;
function directory() {
    if (!FS.documentDirectory)
        throw new Error('Device storage is unavailable.');
    return FS.documentDirectory;
}
const snapshotPattern = /^expense-tracker-v1-(\d{12})-.+\.json$/;
export async function loadData(): Promise<Data> {
    if (Platform.OS === 'web') {
        const raw = localStorage.getItem(key);
        return raw === null ? initialData : parseData(raw);
    }
    const dir = directory();
    const files = (await FS.readDirectoryAsync(dir)).filter(name => snapshotPattern.test(name)).sort();
    const latest = files.at(-1);
    if (latest) {
        const data = parseData(await FS.readAsStringAsync(dir + latest));
        revision = Number(latest.match(snapshotPattern)![1]);
        // Startup is the safe time to remove photos left by abandoned selections.
        try {
            const images = (await FS.readDirectoryAsync(dir)).filter(name => /^profile-[a-z0-9-]+\.jpg$/.test(name));
            for (const name of images)
                if (dir + name !== data.profile.photo)
                    await FS.deleteAsync(dir + name, { idempotent: true });
        }
        catch { /* A cleanup failure must not block loading valid records. */ }
        return data;
    }
    // Support the first build's format, without ever overwriting it.
    const legacy = dir + key + '.json';
    revision = 0;
    return (await FS.getInfoAsync(legacy)).exists ? parseData(await FS.readAsStringAsync(legacy)) : initialData;
}
export async function saveData(data: Data) {
    const raw = JSON.stringify(data);
    if (Platform.OS === 'web') {
        localStorage.setItem(key, raw);
        return;
    }
    const dir = directory();
    const nextRevision = revision + 1;
    const destination = dir + `${key}-${String(nextRevision).padStart(12, '0')}-${id()}.json`;
    const pending = destination + '.pending';
    // Commit to a NEW filename: the previous saved snapshot is never overwritten.
    await FS.writeAsStringAsync(pending, raw);
    parseData(await FS.readAsStringAsync(pending));
    await FS.moveAsync({ from: pending, to: destination });
    revision = nextRevision;
    // Cleanup is best effort AFTER commit. Keep three committed snapshots.
    try {
        const files = (await FS.readDirectoryAsync(dir)).filter(name => snapshotPattern.test(name)).sort();
        for (const name of files.slice(0, -3))
            await FS.deleteAsync(dir + name, { idempotent: true });
        const pendingFiles = (await FS.readDirectoryAsync(dir)).filter(name => name.startsWith(key + '-') && name.endsWith('.json.pending'));
        for (const name of pendingFiles)
            await FS.deleteAsync(dir + name, { idempotent: true });
    }
    catch { /* Cleanup must not turn a successful save into a reported failure. */ }
}
