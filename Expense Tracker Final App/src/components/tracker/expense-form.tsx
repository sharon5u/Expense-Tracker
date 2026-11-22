import React, { useState } from 'react';
import { View } from 'react-native';
import { amountCents, Expense, id, validDate } from '@/lib/model';
import { useStore } from '@/lib/store';
import { Button, ErrorText, Field, Label, Sheet, styles } from './ui';
export default function ExpenseForm({ initial, categoryId, date, onClose }: {
    initial?: Expense;
    categoryId: string;
    date: string;
    onClose: () => void;
}) {
    const { data, update, busy } = useStore();
    const [amount, setAmount] = useState(initial ? (initial.cents / 100).toFixed(2) : '');
    const [note, setNote] = useState(initial?.note ?? '');
    const [when, setWhen] = useState(initial?.date ?? date);
    const [category, setCategory] = useState(initial?.categoryId ?? categoryId);
    const [error, setError] = useState('');
    async function save() {
        setError('');
        try {
            const cents = amountCents(amount);
            if (!validDate(when))
                throw new Error('Enter a real date as YYYY-MM-DD (1900–2199).');
            const expense: Expense = { id: initial?.id ?? id(), cents, categoryId: category, date: when, note: note.trim() };
            await update(d => ({ ...d, expenses: initial ? d.expenses.map(e => e.id === initial.id ? expense : e) : [...d.expenses, expense] }));
            onClose();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not save. Please retry.');
        }
    }
    return <Sheet title={initial ? 'Edit expense' : 'Add expense'} onClose={onClose} busy={busy}>
    <Field label="Amount (USD)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" maxLength={16} editable={!busy}/>
    <Field label="Date (YYYY-MM-DD)" value={when} onChangeText={setWhen} placeholder="2026-11-22" autoCapitalize="none" maxLength={10} editable={!busy}/>
    <Label>Category</Label><View style={[styles.row, { flexWrap: 'wrap' }]}>{data.categories.map(c => <Button key={c.id} text={`${c.icon} ${c.name}`} secondary={c.id !== category} disabled={busy} onPress={() => setCategory(c.id)}/>)}</View>
    <Field label="Note (optional)" value={note} onChangeText={setNote} maxLength={300} placeholder="What was it for?" editable={!busy}/>
    <ErrorText text={error}/><Button text={busy ? 'Saving…' : 'Save expense'} disabled={busy} onPress={() => { void save(); }}/>
  </Sheet>;
}
