import React from 'react';
import { Tabs } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider, useColors, useStore } from '@/lib/store';
import { Button, ErrorText } from '@/components/tracker/ui';
function Navigation() {
    const { ready, error, reload, data } = useStore();
    const c = useColors();
    if (!ready)
        return <View style={{ flex: 1, justifyContent: 'center', padding: 28, gap: 20, backgroundColor: c.bg }}>{error ? <><ErrorText text={error}/><Button text="Retry loading" onPress={() => { void reload(); }}/></> : <ActivityIndicator color={c.accent} accessibilityLabel="Loading expenses"/>}</View>;
    return <><StatusBar style={data.profile.dark ? 'light' : 'dark'}/><Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: c.accent, tabBarInactiveTintColor: c.muted, tabBarStyle: { backgroundColor: c.card, borderTopColor: c.line } }}>
    <Tabs.Screen name="index" options={{ title: 'My Wallet', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 23 }}>▣</Text> }}/>
    <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 23 }}>▦</Text> }}/>
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 23 }}>◎</Text> }}/>
  </Tabs></>;
}
export default function Root() { return <SafeAreaProvider><StoreProvider><Navigation /></StoreProvider></SafeAreaProvider>; }
