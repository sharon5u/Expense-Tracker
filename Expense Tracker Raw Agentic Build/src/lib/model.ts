export type Category = { id: string; name: string; icon: string };
export type Expense = { id: string; categoryId: string; cents: number; date: string; note: string };
export type Data = { version: 1; categories: Category[]; expenses: Expense[]; profile: { name: string; photo: string | null; dark: boolean } };
export const initialData: Data = { version: 1, categories: [
  { id: 'food', name: 'Food', icon: '🍜' }, { id: 'transport', name: 'Transportation', icon: '🚆' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' }, { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'medical', name: 'Medical', icon: '🩺' }, { id: 'other', name: 'Other', icon: '✦' },
], expenses: [], profile: { name: 'My profile', photo: null, dark: false } };
export const pad = (n: number) => String(n).padStart(2, '0');
export const dateKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const monthKey = (date = new Date()) => dateKey(date).slice(0, 7);
export const id = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export function validMonth(value: string) { return /^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/.test(value); }
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !validMonth(value.slice(0, 7))) return false;
  const [y, m, d] = value.split('-').map(Number);
  return d >= 1 && d <= new Date(y, m, 0).getDate();
}
export function amountCents(value: string) {
  const clean = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) throw new Error('Enter a positive amount with no more than two decimal places.');
  const [whole, fraction = ''] = clean.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 999999999) throw new Error('Enter an amount between $0.01 and $9,999,999.99.');
  return cents;
}
export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  return monthKey(new Date(y, m - 1 + delta, 1));
}
export function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
export const total = (expenses: Expense[]) => expenses.reduce((sum, e) => sum + e.cents, 0);
export function monthsBetween(start: string, end: string) {
  if (!validMonth(start) || !validMonth(end) || start > end) throw new Error('Enter valid months (YYYY-MM), with the start before or equal to the end.');
  const result: string[] = [];
  for (let m = start; m <= end; m = shiftMonth(m, 1)) result.push(m);
  return result;
}
export function parseData(raw: string): Data {
  const d = JSON.parse(raw);
  if (d?.version !== 1 || !Array.isArray(d.categories) || !d.categories.length || !Array.isArray(d.expenses)
      || typeof d.profile?.name !== 'string' || typeof d.profile?.dark !== 'boolean'
      || !(d.profile.photo === null || typeof d.profile.photo === 'string')) throw new Error('Invalid saved data.');
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const c of d.categories) {
    if (typeof c.id !== 'string' || typeof c.name !== 'string' || !c.name.trim() || typeof c.icon !== 'string'
      || ids.has(c.id) || names.has(c.name.trim().toLowerCase())) throw new Error('Invalid saved categories.');
    ids.add(c.id); names.add(c.name.trim().toLowerCase());
  }
  const expenseIds = new Set<string>();
  for (const e of d.expenses) {
    if (typeof e.id !== 'string' || expenseIds.has(e.id) || !ids.has(e.categoryId) || !Number.isSafeInteger(e.cents)
      || e.cents <= 0 || typeof e.date !== 'string' || !validDate(e.date) || typeof e.note !== 'string') throw new Error('Invalid saved expenses.');
    expenseIds.add(e.id);
  }
  return d;
}
