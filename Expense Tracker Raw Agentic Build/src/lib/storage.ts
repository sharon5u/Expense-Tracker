import { Platform } from 'react-native';
import * as FS from 'expo-file-system/legacy';
import { Data, initialData, parseData } from './model';
const key = 'expense-tracker-v1';
function file() {
  if (!FS.documentDirectory) throw new Error('Device storage is unavailable.');
  return FS.documentDirectory + key + '.json';
}
export async function loadData(): Promise<Data> {
  if (Platform.OS === 'web') {
    const raw = localStorage.getItem(key);
    return raw === null ? initialData : parseData(raw);
  }
  const path = file();
  if (!(await FS.getInfoAsync(path)).exists) return initialData;
  return parseData(await FS.readAsStringAsync(path));
}
export async function saveData(data: Data) {
  const raw = JSON.stringify(data);
  if (Platform.OS === 'web') { localStorage.setItem(key, raw); return; }
  const destination = file();
  const pending = destination + '.pending';
  await FS.writeAsStringAsync(pending, raw);
  await FS.moveAsync({ from: pending, to: destination });
}
