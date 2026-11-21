import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/lib/constants';
import { useStudyStore } from '@/store/useStudyStore';

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(useStudyStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useStudyStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useStudyStore.persist.hasHydrated());
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy }}>
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
          headerBackTitle: '戻る',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ title: '問題', gestureEnabled: false }} />
        <Stack.Screen name="result" options={{ title: '結果', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
        <Stack.Screen name="bookmarks" options={{ title: 'ブックマーク' }} />
        <Stack.Screen name="lesson/[id]" options={{ title: '教材' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
