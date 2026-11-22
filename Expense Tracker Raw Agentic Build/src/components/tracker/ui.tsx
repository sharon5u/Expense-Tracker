import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/lib/store';
import { monthLabel, shiftMonth, validMonth } from '@/lib/model';
export function Label({ children, title = false, muted = false }: React.PropsWithChildren<{ title?: boolean; muted?: boolean }>) {
  const c = useColors(); return <Text style={{ color: muted ? c.muted : c.text, fontSize: title ? 28 : 16, fontWeight: title ? '700' : '400', lineHeight: title ? 36 : 24 }}>{children}</Text>;
}
export function Button({ text, onPress, secondary = false, disabled = false }: { text: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const c = useColors(); return <Pressable accessibilityRole="button" accessibilityLabel={text} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ backgroundColor: secondary ? c.card : c.accent, borderColor: c.line, borderWidth: secondary ? 1 : 0, borderRadius: 14, padding: 14, minHeight: 48, opacity: disabled ? 0.45 : pressed ? 0.7 : 1 })}><Text style={{ color: secondary ? c.text : c.onAccent, textAlign: 'center', fontWeight: '600', fontSize: 16 }}>{text}</Text></Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const c = useColors(); return <View style={styles.gap}><Label>{label}</Label><TextInput {...props} accessibilityLabel={label} placeholderTextColor={c.muted} style={[{ color: c.text, backgroundColor: c.card, borderColor: c.line, borderWidth: 1, borderRadius: 12, padding: 14, minHeight: 50, fontSize: 16 }, props.style]} /></View>;
}
export function ErrorText({ text }: { text: string }) { const c = useColors(); return text ? <Text accessibilityRole="alert" style={{ color: c.error, fontSize: 15, lineHeight: 22 }}>{text}</Text> : null; }
export function Card({ children }: React.PropsWithChildren) { const c = useColors(); return <View style={{ padding: 20, borderRadius: 22, gap: 12, backgroundColor: c.card, borderWidth: 1, borderColor: c.line }}>{children}</View>; }
export function Page({ title, subtitle, children }: React.PropsWithChildren<{ title: string; subtitle: string }>) {
  const c = useColors(); return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.bg }}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}><View><Label muted>{subtitle}</Label><Label title>{title}</Label></View>{children}</ScrollView></SafeAreaView>;
}
export function MonthPicker({ month, onChange }: { month: string; onChange: (m: string) => void }) {
  return <View style={styles.row}><Button text="‹" secondary disabled={!validMonth(shiftMonth(month, -1))} onPress={() => onChange(shiftMonth(month, -1))} /><View style={{ flex: 1, alignItems: 'center' }}><Label>{monthLabel(month)}</Label></View><Button text="›" secondary disabled={!validMonth(shiftMonth(month, 1))} onPress={() => onChange(shiftMonth(month, 1))} /></View>;
}
export function Sheet({ title, onClose, children, busy = false }: React.PropsWithChildren<{ title: string; onClose: () => void; busy?: boolean }>) {
  const c = useColors(); return <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { if (!busy) onClose(); }}><SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}><Label title>{title}</Label>{children}<Button text="Cancel" secondary disabled={busy} onPress={onClose} /></ScrollView></KeyboardAvoidingView></SafeAreaView></Modal>;
}
export const styles = StyleSheet.create({ page: { padding: 22, gap: 22, paddingBottom: 40, width: '100%', maxWidth: 760, alignSelf: 'center' }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, gap: { gap: 8 } });
