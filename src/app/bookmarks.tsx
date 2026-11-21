import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen } from '@/components/ui';
import { QUESTIONS } from '@/data/questions';
import { colors, difficultyLabel, domainShort } from '@/lib/constants';
import { useStudyStore } from '@/store/useStudyStore';

export default function BookmarksScreen() {
  const reviews = useStudyStore((s) => s.reviews);
  const startSession = useStudyStore((s) => s.startSession);

  const items = QUESTIONS.filter((q) => reviews[q.id]?.bookmarked);

  const solve = (ids: string[]) => {
    startSession('practice', ids);
    router.push('/quiz');
  };

  return (
    <Screen
      footer={
        items.length > 0 ? (
          <Button label={`${items.length} 問をまとめて解き直す`} icon="play" onPress={() => solve(items.map((q) => q.id))} />
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <Card>
          <Text style={s.empty}>
            ブックマークした問題はまだありません。問題画面の右上のしおりマークで保存できます。
          </Text>
        </Card>
      ) : (
        items.map((q) => {
          const memo = reviews[q.id]?.memo;
          return (
            <Pressable key={q.id} onPress={() => solve([q.id])}>
              {({ pressed }) => (
                <Card style={pressed ? { opacity: 0.7 } : undefined}>
                  <View style={s.tags}>
                    <Text style={s.tag}>{domainShort(q.domain)}</Text>
                    <Text style={s.services}>{difficultyLabel(q.difficulty)}</Text>
                    <Text style={s.services}>{q.services.join(' · ')}</Text>
                  </View>
                  <Text style={s.stem} numberOfLines={3}>
                    {q.stem}
                  </Text>
                  {memo ? <Text style={s.memo}>メモ：{memo}</Text> : null}
                </Card>
              )}
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  empty: { fontSize: 14, lineHeight: 21, color: colors.sub },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
    backgroundColor: colors.orangeSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  services: { fontSize: 12, color: colors.sub },
  stem: { fontSize: 14.5, lineHeight: 22, color: colors.text },
  memo: { fontSize: 13, color: colors.navy, backgroundColor: '#EEF2FA', padding: 8, borderRadius: 8, overflow: 'hidden' },
});
