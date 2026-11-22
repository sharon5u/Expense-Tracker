import React, { useState } from 'react';
import { Image, Platform, ScrollView, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FS from 'expo-file-system/legacy';
import { id, money, monthKey, monthsBetween, shiftMonth, total } from '@/lib/model';
import { useColors, useStore } from '@/lib/store';
import { Button, Card, ErrorText, Field, Label, Page, styles } from '@/components/tracker/ui';
function Chart({ months }: { months: string[] }) {
  const { data } = useStore(); const c = useColors();
  const values = months.map(m => total(data.expenses.filter(e => e.date.startsWith(m))));
  const max = Math.max(...values, 100); const spacing = 100; const height = 160;
  const points = values.map((v, i) => ({ x: 50 + i * spacing, y: 30 + height * (1 - v / max) }));
  return <><Label muted>Monthly spending · USD · Scroll to view more months</Label><ScrollView horizontal><View style={{ width: Math.max(260, months.length * spacing), height: 270 }}>
    <View style={{ position: 'absolute', top: 190, left: 20, right: 20, height: 1, backgroundColor: c.line }} />
    {points.slice(1).map((p, i) => { const a = points[i]; const dx = p.x - a.x; const dy = p.y - a.y; const length = Math.hypot(dx, dy); return <View key={`line-${i}`} style={{ position: 'absolute', left: (a.x + p.x) / 2 - length / 2, top: (a.y + p.y) / 2 - 1.5, width: length, height: 3, backgroundColor: c.accent, transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }] }} />; })}
    {points.map((p, i) => <React.Fragment key={months[i]}><View accessible accessibilityLabel={`${months[i]}: ${money(values[i])}`} style={{ position: 'absolute', left: p.x - 5, top: p.y - 5, width: 10, height: 10, borderRadius: 5, backgroundColor: c.accent }} /><Text style={{ position: 'absolute', left: p.x - 48, top: p.y - 26, width: 96, textAlign: 'center', color: c.text, fontSize: 11 }}>{money(values[i])}</Text><Text style={{ position: 'absolute', left: p.x - 40, top: 210, width: 80, textAlign: 'center', color: c.muted }}>{months[i]}</Text></React.Fragment>)}
  </View></ScrollView></>;
}
export default function Profile() {
  const { data, update, busy } = useStore(); const c = useColors();
  const [name, setName] = useState(data.profile.name); const [photo, setPhoto] = useState(data.profile.photo);
  const [error, setError] = useState(''); const [picking, setPicking] = useState(false);
  const [start, setStart] = useState(shiftMonth(monthKey(), -5)); const [end, setEnd] = useState(monthKey());
  const [months, setMonths] = useState(monthsBetween(start, end)); const [rangeError, setRangeError] = useState('');
  async function choosePhoto() {
    setError(''); setPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6, base64: Platform.OS === 'web' });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (Platform.OS === 'web') {
          if (!asset.base64) throw new Error('Could not read that photo. Try another image.');
          setPhoto(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
        } else {
          if (!FS.documentDirectory) throw new Error('Photo storage is unavailable.');
          const destination = FS.documentDirectory + `profile-${id()}.jpg`;
          await FS.copyAsync({ from: asset.uri, to: destination }); setPhoto(destination);
        }
      }
    } catch { setError('Could not select that photo. Check photo access in Settings and try again.'); }
    finally { setPicking(false); }
  }
  async function saveProfile() {
    setError('');
    try {
      if (!name.trim()) throw new Error('Enter a username.');
      await update(d => ({ ...d, profile: { ...d.profile, name: name.trim(), photo } }));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save profile.'); }
  }
  async function setDark(dark: boolean) {
    setError(''); try { await update(d => ({ ...d, profile: { ...d.profile, dark } })); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save theme.'); }
  }
  const changed = name.trim() !== data.profile.name || photo !== data.profile.photo;
  return <Page title="Profile" subtitle="Your wallet, your way."><Card>
    <View style={{ alignItems: 'center' }}>{photo ? <Image accessibilityLabel="Profile picture" source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 50 }} /> : <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: c.onAccent, fontSize: 40 }}>{(name.trim()[0] || '?').toUpperCase()}</Text></View>}</View>
    <Button text={picking ? 'Opening photos…' : 'Choose profile picture'} secondary disabled={busy || picking} onPress={() => { void choosePhoto(); }} />
    <Field label="Username" value={name} onChangeText={setName} maxLength={40} editable={!busy} />
    <Button text={busy ? 'Saving…' : 'Save profile'} disabled={busy || picking || !changed} onPress={() => { void saveProfile(); }} />
    <Label muted>{changed ? 'Unsaved profile changes' : 'Profile saved on this device'}</Label><ErrorText text={error} />
    <View style={styles.row}><View style={{ flex: 1 }}><Label>Dark theme</Label></View><Switch accessibilityLabel="Dark theme" value={data.profile.dark} disabled={busy} onValueChange={value => { void setDark(value); }} trackColor={{ true: c.accent }} /></View>
  </Card><Card><Label title>Spending over time</Label><Field label="Start month (YYYY-MM)" value={start} onChangeText={setStart} maxLength={7} autoCapitalize="none" /><Field label="End month (YYYY-MM)" value={end} onChangeText={setEnd} maxLength={7} autoCapitalize="none" /><ErrorText text={rangeError} /><Button text="Update chart" secondary onPress={() => { try { const next = monthsBetween(start, end); setMonths(next); setRangeError(''); } catch (e) { setRangeError(e instanceof Error ? e.message : 'Invalid range'); } }} /><Chart months={months} /></Card><Label muted>Records stay on this device. No bank connections or cloud account. Avoid putting account numbers or passwords in notes.</Label></Page>;
}
