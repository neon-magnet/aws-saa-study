import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, ProgressBar, Screen } from '@/components/ui';
import { questionById } from '@/data/questions';
import { colors, DOMAINS } from '@/lib/constants';
import { useStudyStore } from '@/store/useStudyStore';

export default function ResultScreen() {
  const session = useStudyStore((s) => s.session);
  const startSession = useStudyStore((s) => s.startSession);
  const endSession = useStudyStore((s) => s.endSession);

  const goHome = () => {
    endSession();
    router.replace('/');
  };

  if (!session) {
    return (
      <Screen>
        <Button label="ホームへ" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const answers = session.answers;
  const correct = answers.filter((a) => a.is_correct).length;
  const rate = answers.length ? correct / answers.length : 0;
  const wrongIds = answers.filter((a) => !a.is_correct).map((a) => a.question_id);

  const byDomain = DOMAINS.map((d) => {
    const list = answers.filter((a) => questionById(a.question_id)?.domain === d.key);
    return { ...d, n: list.length, ok: list.filter((a) => a.is_correct).length };
  }).filter((d) => d.n > 0);

  return (
    <Screen
      footer={
        <>
          {wrongIds.length > 0 ? (
            <Button
              label={`間違えた ${wrongIds.length} 問をもう一度`}
              icon="refresh"
              variant="secondary"
              onPress={() => {
                startSession('practice', wrongIds);
                router.replace('/quiz');
              }}
            />
          ) : null}
          <Button label="ホームへ" icon="home" onPress={goHome} />
        </>
      }
    >
      <View style={s.hero}>
        <Text style={s.heroLabel}>{session.mode === 'review' ? '復習の結果' : '演習の結果'}</Text>
        <Text style={s.heroBig}>
          {correct}
          <Text style={s.heroUnit}> / {answers.length} 問正解</Text>
        </Text>
        <Text style={s.heroRate}>正答率 {Math.round(rate * 100)}%</Text>
      </View>

      <Card>
        <Text style={s.cardTitle}>分野別</Text>
        {byDomain.map((d) => (
          <View key={d.key} style={{ gap: 4 }}>
            <View style={s.rowBetween}>
              <Text style={s.label}>{d.short}</Text>
              <Text style={s.value}>
                {d.ok} / {d.n}
              </Text>
            </View>
            <ProgressBar value={d.ok / d.n} color={d.ok / d.n >= 0.72 ? colors.correct : colors.orange} />
          </View>
        ))}
      </Card>

      <Card style={{ gap: 8 }}>
        <Text style={s.cardTitle}>回答した問題</Text>
        {answers.map((a, i) => {
          const q = questionById(a.question_id);
          return (
            <View key={a.question_id} style={s.qRow}>
              <Ionicons
                name={a.is_correct ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={a.is_correct ? colors.correct : colors.wrong}
              />
              <Text style={s.qText} numberOfLines={2}>
                {i + 1}. {q?.stem}
              </Text>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 16, padding: 20, alignItems: 'center', gap: 4 },
  heroLabel: { color: '#C9D3E6', fontSize: 13, fontWeight: '600' },
  heroBig: { color: '#fff', fontSize: 40, fontWeight: '800' },
  heroUnit: { fontSize: 16, fontWeight: '600' },
  heroRate: { color: colors.orange, fontSize: 16, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.navy },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14, color: colors.text },
  value: { fontSize: 14, fontWeight: '700', color: colors.text },
  qRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  qText: { flex: 1, fontSize: 13.5, lineHeight: 19, color: colors.text },
});
