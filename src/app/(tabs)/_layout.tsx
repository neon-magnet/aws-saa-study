import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { Platform, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/constants';

type IconName = keyof typeof Ionicons.glyphMap;

const icon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={typeof color === 'string' ? color : colors.sub} />
  );

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.sub,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 15, flexShrink: 0, fontWeight: '600' },
        // Web ではラベルが欠けないよう高さを確保し、iPhone のホームインジケーター分の余白も足す
        tabBarStyle:
          Platform.OS === 'web' ? { height: 64 + insets.bottom, paddingBottom: 6 + insets.bottom } : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerTitle: 'AWS SAA学習アプリ', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="study" options={{ title: '学習', headerTitle: '問題演習', tabBarIcon: icon('book') }} />
      <Tabs.Screen name="progress" options={{ title: '進捗', tabBarIcon: icon('stats-chart') }} />
      <Tabs.Screen name="settings" options={{ title: '設定', tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
