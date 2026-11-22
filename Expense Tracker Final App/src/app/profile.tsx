import React, { useState } from 'react';
import { FlatList, Image, Platform, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FS from 'expo-file-system/legacy';
import { id, money, monthKey, monthsBetween, shiftMonth } from '@/lib/model';
import { useColors, useStore } from '@/lib/store';
import { Button, Card, ErrorText, Field, Label, Page, styles } from '@/components/tracker/ui';
function Chart({ months }: {
    months: string[];
}) {
    const { data } = useStore();
    const c = useColors();
    const totals = new Map<string, number>();
    for (const expense of data.expenses) {
        const key = expense.date.slice(0, 7);
        totals.set(key, (totals.get(key) || 0) + expense.cents);
    }
    const values = months.map(m => totals.get(m) || 0);
    const max = Math.max(...values, 100);
    const y = (index: number) => 30 + 160 * (1 - values[index] / max);
    return <><Label muted>Monthly spending · USD · Scroll to view more months</Label>
    <FlatList horizontal data={months} keyExtractor={m => m} initialNumToRender={8} maxToRenderPerBatch={12} windowSize={5} getItemLayout={(_, index) => ({ length: 100, offset: 100 * index, index })} style={{ height: 270 }} renderItem={({ item, index }) => {
            const top = y(index);
            const next = index + 1 < months.length ? y(index + 1) : top;
            const length = Math.hypot(100, next - top);
            return <View style={{ width: 100, height: 270 }}>
        <View style={{ position: 'absolute', top: 190, left: 0, right: 0, height: 1, backgroundColor: c.line }}/>
        {index + 1 < months.length && <View style={{ position: 'absolute', left: 100 - length / 2, top: (top + next) / 2 - 1.5, width: length, height: 3, backgroundColor: c.accent, transform: [{ rotate: `${Math.atan2(next - top, 100)}rad` }] }}/>}
        <View accessible accessibilityLabel={`${item}: ${money(values[index])}`} style={{ position: 'absolute', left: 45, top: top - 5, width: 10, height: 10, borderRadius: 5, backgroundColor: c.accent }}/>
        <Text style={{ position: 'absolute', left: 2, top: top - 26, width: 96, textAlign: 'center', color: c.text, fontSize: 11 }}>{money(values[index])}</Text>
        <Text style={{ position: 'absolute', left: 10, top: 210, width: 80, textAlign: 'center', color: c.muted }}>{item}</Text>
      </View>;
        }}/>
  </>;
}
export default function Profile() {
    const { data, update, busy } = useStore();
    const c = useColors();
    const [name, setName] = useState(data.profile.name);
    const [photo, setPhoto] = useState(data.profile.photo);
    const [error, setError] = useState('');
    const [pendingDark, setPendingDark] = useState<boolean | null>(null);
    const [picking, setPicking] = useState(false);
    const [start, setStart] = useState(shiftMonth(monthKey(), -5));
    const [end, setEnd] = useState(monthKey());
    const [months, setMonths] = useState(monthsBetween(start, end));
    const [rangeError, setRangeError] = useState('');
    async function cleanupPhoto(uri: string | null) {
        if (Platform.OS !== 'web' && uri && FS.documentDirectory && uri.startsWith(FS.documentDirectory + 'profile-')) {
            try {
                await FS.deleteAsync(uri, { idempotent: true });
            }
            catch { /* Retry orphan cleanup at next startup. */ }
        }
    }
    async function choosePhoto() {
        setError('');
        setPicking(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6, base64: Platform.OS === 'web' });
            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                if (Platform.OS === 'web') {
                    if (!asset.base64)
                        throw new Error('Could not read that photo. Try another image.');
                    setPhoto(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
                }
                else {
                    if (!FS.documentDirectory)
                        throw new Error('Photo storage is unavailable.');
                    const destination = FS.documentDirectory + `profile-${id()}.jpg`;
                    await FS.copyAsync({ from: asset.uri, to: destination });
                    setPhoto(destination);
                    if (photo && photo !== data.profile.photo)
                        await cleanupPhoto(photo);
                }
            }
        }
        catch {
            setError('Could not select that photo. Check photo access in Settings and try again.');
        }
        finally {
            setPicking(false);
        }
    }
    async function saveProfile() {
        setError('');
        try {
            if (!name.trim())
                throw new Error('Enter a username.');
            const previous = data.profile.photo;
            await update(d => ({ ...d, profile: { ...d.profile, name: name.trim(), photo } }));
            if (previous !== photo)
                await cleanupPhoto(previous);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not save profile.');
        }
    }
    async function setDark(dark: boolean) {
        setError('');
        setPendingDark(dark);
        try {
            await update(d => ({ ...d, profile: { ...d.profile, dark } }));
            setPendingDark(null);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Could not save theme.');
        }
    }
    const changed = name.trim() !== data.profile.name || photo !== data.profile.photo;
    return <Page title="Profile" subtitle="Your wallet, your way."><Card>
    <View style={{ alignItems: 'center' }}>{photo ? <Image accessibilityLabel="Profile picture" source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 50 }}/> : <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: c.onAccent, fontSize: 40 }}>{(name.trim()[0] || '?').toUpperCase()}</Text></View>}</View>
    <Button text={picking ? 'Opening photos…' : 'Choose profile picture'} secondary disabled={busy || picking} onPress={() => { void choosePhoto(); }}/>
    <Field label="Username" value={name} onChangeText={setName} maxLength={40} editable={!busy}/>
    <Button text={busy ? 'Saving…' : 'Save profile'} disabled={busy || picking || !changed} onPress={() => { void saveProfile(); }}/>
    <Label muted>{changed ? 'Unsaved profile changes' : 'Profile saved on this device'}</Label><ErrorText text={error}/>{pendingDark !== null && <Button text="Retry saving theme" disabled={busy} onPress={() => { void setDark(pendingDark); }}/>}
    <View style={styles.row}><View style={{ flex: 1 }}><Label>Dark theme</Label></View><Switch accessibilityLabel="Dark theme" value={data.profile.dark} disabled={busy} onValueChange={value => { void setDark(value); }} trackColor={{ true: c.accent }}/></View>
  </Card><Card><Label title>Spending over time</Label><Field label="Start month (YYYY-MM)" value={start} onChangeText={setStart} maxLength={7} autoCapitalize="none"/><Field label="End month (YYYY-MM)" value={end} onChangeText={setEnd} maxLength={7} autoCapitalize="none"/><ErrorText text={rangeError}/><Button text="Update chart" secondary onPress={() => { try {
        const next = monthsBetween(start, end);
        setMonths(next);
        setRangeError('');
    }
    catch (e) {
        setRangeError(e instanceof Error ? e.message : 'Invalid range');
    } }}/><Chart months={months}/></Card><Label muted>Records stay on this device. No bank connections or cloud account. Avoid putting account numbers or passwords in notes.</Label></Page>;
}
