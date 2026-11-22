import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { dateKey, id, money, monthKey, total } from '@/lib/model';
import { useColors, useStore } from '@/lib/store';
import { Button, Card, ErrorText, Field, Label, MonthPicker, Page, Sheet } from '@/components/tracker/ui';
import ExpenseForm from '@/components/tracker/expense-form';
export default function Wallet() {
  const { data, update, busy } = useStore(); const c = useColors();
  const [month, setMonth] = useState(monthKey());
  const [category, setCategory] = useState<string | null>(null);
  const [adding, setAdding] = useState(false); const [name, setName] = useState(''); const [error, setError] = useState('');
  const entries = data.expenses.filter(e => e.date.startsWith(month));
  async function addCategory() {
    setError('');
    try {
      const clean = name.trim();
      if (!clean) throw new Error('Enter a category name.');
      await update(d => {
        if (d.categories.some(cat => cat.name.toLowerCase() === clean.toLowerCase())) throw new Error('That category already exists.');
        return { ...d, categories: [...d.categories, { id: id(), name: clean, icon: '✦' }] };
      }); setAdding(false); setName('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save category.'); }
  }
  return <Page title="My Wallet" subtitle="A little clarity, every day.">
    <MonthPicker month={month} onChange={setMonth} /><Card><Label muted>MONTHLY SPENDING · USD</Label><Text style={{ fontSize: 38, fontWeight: '700', color: c.text }}>{money(total(entries))}</Text><Label muted>{entries.length} {entries.length === 1 ? 'expense' : 'expenses'} recorded</Label></Card>
    <Label title>Categories</Label><Label muted>Tap a category to record an expense.</Label>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{data.categories.map(cat => <Pressable accessibilityRole="button" accessibilityLabel={`Add ${cat.name} expense, total ${money(total(entries.filter(e => e.categoryId === cat.id)))}`} key={cat.id} onPress={() => setCategory(cat.id)} style={({ pressed }) => ({ width: '47%', flexGrow: 1, backgroundColor: c.card, borderColor: c.line, borderWidth: 1, borderRadius: 20, padding: 18, gap: 8, opacity: pressed ? 0.7 : 1 })}><Text style={{ fontSize: 30 }}>{cat.icon}</Text><Label>{cat.name}</Label><Text style={{ color: c.accent, fontWeight: '700', fontSize: 20 }}>{money(total(entries.filter(e => e.categoryId === cat.id)))}</Text></Pressable>)}</View>
    {!entries.length && <Label muted>No expenses this month. Your first entry starts here.</Label>}
    <Button text="＋ Add category" secondary onPress={() => { setError(''); setAdding(true); }} />
    {category && <ExpenseForm categoryId={category} date={month === monthKey() ? dateKey() : `${month}-01`} onClose={() => setCategory(null)} />}
    {adding && <Sheet title="New category" onClose={() => setAdding(false)} busy={busy}><Field label="Category name" value={name} onChangeText={setName} maxLength={40} editable={!busy} /><ErrorText text={error} /><Button text={busy ? 'Saving…' : 'Save category'} disabled={busy} onPress={() => { void addCategory(); }} /></Sheet>}
  </Page>;
}
