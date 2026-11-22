import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { dateKey, Expense, money, monthKey, pad, total } from '@/lib/model';
import { useColors, useStore } from '@/lib/store';
import { Button, Card, Label, MonthPicker, Page, styles } from '@/components/tracker/ui';
import ExpenseForm from '@/components/tracker/expense-form';
export default function Calendar() {
    const { data } = useStore();
    const c = useColors();
    const [month, setMonth] = useState(monthKey());
    const [selected, setSelected] = useState(dateKey());
    const [form, setForm] = useState<{
        expense?: Expense;
    } | null>(null);
    const [year, mon] = month.split('-').map(Number);
    const offset = new Date(year, mon - 1, 1).getDay();
    const days = new Date(year, mon, 0).getDate();
    const entries = data.expenses.filter(e => e.date.startsWith(month));
    const daily = entries.filter(e => e.date === selected);
    const ranked = data.categories.map(cat => ({ ...cat, cents: total(entries.filter(e => e.categoryId === cat.id)) })).filter(cat => cat.cents > 0).sort((a, b) => b.cents - a.cents || a.name.localeCompare(b.name)).slice(0, 5);
    return <Page title="Calendar" subtitle="A peek at each day"><MonthPicker month={month} onChange={m => { setMonth(m); setSelected(m === monthKey() ? dateKey() : m + '-01'); }}/>
    <Card><View style={{ flexDirection: 'row' }}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <Text key={i} style={{ width: '14.2857%', textAlign: 'center', color: c.muted }}>{day}</Text>)}</View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{Array.from({ length: offset + days }, (_, i) => {
            const day = i - offset + 1;
            const key = `${month}-${pad(day)}`;
            const active = key === selected;
            const today = key === dateKey();
            return day < 1 ? <View key={i} style={{ width: '14.2857%', height: 48 }}/> : <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${key}${today ? ', today' : ''}`} accessibilityState={{ selected: active }} onPress={() => setSelected(key)} style={{ width: '14.2857%', minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: today ? 2 : 0, borderColor: c.accent, backgroundColor: active ? c.accent : 'transparent' }}><Text style={{ color: active ? c.onAccent : c.text, fontSize: 16, fontWeight: today ? '700' : '400' }}>{day}</Text><Text style={{ color: active ? c.onAccent : c.accent, height: 12, fontSize: 10 }}>{entries.some(e => e.date === key) ? '●' : ''}</Text></Pressable>;
        })}</View><Label muted>Outlined date: today · Dot: recorded expenses</Label></Card>
    <Label title>{selected}</Label>{daily.length ? daily.map(e => <Pressable key={e.id} accessibilityRole="button" accessibilityLabel={`Edit ${e.note || 'expense'} ${money(e.cents)}`} onPress={() => setForm({ expense: e })}><Card><View style={styles.row}><View style={{ flex: 1 }}><Label>{data.categories.find(cat => cat.id === e.categoryId)?.name}</Label><Label muted>{e.note || 'No note'} · Tap to edit</Label></View><Label>{money(e.cents)}</Label></View></Card></Pressable>) : <Label muted>No expenses on this date.</Label>}
    <Button text="＋ Add expense on this date" onPress={() => setForm({})}/>
    <Card tone="butter"><Label title>This month, all together</Label><Label>Total spending: {money(total(entries))}</Label>{ranked.length ? ranked.map((cat, i) => <View key={cat.id} style={styles.row}><View style={{ flex: 1 }}><Label>{i + 1}. {cat.icon} {cat.name}</Label></View><Label>{money(cat.cents)}</Label></View>) : <Label muted>No expenses this month.</Label>}</Card>
    {form && <ExpenseForm initial={form.expense} categoryId={data.categories[0].id} date={selected} onClose={() => setForm(null)}/>}
  </Page>;
}
