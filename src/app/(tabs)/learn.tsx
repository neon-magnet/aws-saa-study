import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen } from '@/components/ui';
import { LESSONS } from '@/data/lessons';
import { colors, DOMAINS } from '@/lib/constants';
import { latestByQuestion } from '@/lib/stats';
import { useStudyStore } from '@/store/useStudyStore';

export default function LearnScreen() {
  const readLessons = useStudyStore((s) => s.readLessons);
  const logs = useStudyStore((s) => s.logs);
  const latest = latestByQuestion(logs);

  const readCount = LESSONS.filter((l) => readLessons[l.id]).length;

  return (
    <Screen>
      <View style={s.hero}>
        <Text style={s.heroLabel}>教材の読了</Text>
        <Text style={s.heroBig}>
          {readCount}
          <Text style={s.heroUnit}> / {LESSONS.length} 単元</Text>
        </Text>
        <ProgressBar value={readCount / LESSONS.length} />
        <Text style={s.heroNote}>読み終えたら、単元の最後から問題演習へ進めます</Text>
      </View>

      {DOMAINS.map((d) => {
        const lessons = LESSONS.filter((l) => l.domain === d.key);
        return (
          <View key={d.key} style={{ gap: 8 }}>
            <Text style={s.domainTitle}>
              {d.label}
              <Text style={s.weight}>  配点 {Math.round(d.weight * 100)}%</Text>
            </Text>
            <Card style={{ gap: 0, paddingVertical: 4 }}>
              {lessons.map((l, i) => {
                const read = !!readLessons[l.id];
                const solved = l.questionIds.filter((q) => latest.get(q)?.is_correct).length;
                return (
                  <Pressable
                    key={l.id}
                    onPress={() => router.push(`/lesson/${l.id}`)}
                    style={({ pressed }) => [s.row, i > 0 && s.rowBorder, pressed && { opacity: 0.7 }]}
                  >
                    <Ionicons
                      name={read ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={read ? colors.correct : colors.border}
                    />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={s.title}>{l.title}</Text>
                      <Text style={s.sub} numberOfLines={2}>
                        {l.summary}
                      </Text>
                      <Text style={s.meta}>
                        約 {l.minutes} 分 · 問題 {solved} / {l.questionIds.length} 正解
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.sub} />
                  </Pressable>
                );
              })}
            </Card>
          </View>
        );
      })}
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 16, padding: 18, gap: 8 },
  heroLabel: { color: '#C9D3E6', fontSize: 13, fontWeight: '600' },
  heroBig: { color: '#fff', fontSize: 30, fontWeight: '800' },
  heroUnit: { fontSize: 15, fontWeight: '600' },
  heroNote: { color: '#C9D3E6', fontSize: 12.5 },
  domainTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 6 },
  weight: { fontSize: 12, fontWeight: '400', color: colors.sub },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, lineHeight: 19, color: colors.sub },
  meta: { fontSize: 12, color: colors.navy, fontWeight: '600', marginTop: 2 },
});
