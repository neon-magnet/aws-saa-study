import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Screen, SectionTitle } from '@/components/ui';
import { colors, DIFFICULTIES, DOMAINS } from '@/lib/constants';
import { countPool, pickPracticeQuestions, type PracticeFilter } from '@/lib/stats';
import { useStudyStore } from '@/store/useStudyStore';
import type { Difficulty, Domain } from '@/types';

const COUNTS = [5, 10, 20];
type Level = 'all' | Difficulty;
const LEVELS: { key: Level; label: string; desc: string }[] = [
  { key: 'all', label: 'すべて', desc: '基礎と応用をまぜて出題' },
  ...DIFFICULTIES.map((d) => ({ key: d.key as Level, label: d.label, desc: d.desc })),
];
const FILTERS: { key: PracticeFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'unanswered', label: '未回答のみ' },
  { key: 'wrong', label: '前回不正解のみ' },
];

export default function StudyScreen() {
  const logs = useStudyStore((s) => s.logs);
  const startSession = useStudyStore((s) => s.startSession);

  const [domains, setDomains] = useState<Domain[]>(DOMAINS.map((d) => d.key));
  const [level, setLevel] = useState<Level>('all');
  const [count, setCount] = useState(10);
  const difficulties: Difficulty[] = level === 'all' ? DIFFICULTIES.map((d) => d.key) : [level];
  const [filter, setFilter] = useState<PracticeFilter>('all');

  const available = countPool(logs, domains, difficulties, filter);
  const willAsk = Math.min(available, count);

  const toggleDomain = (d: Domain) =>
    setDomains((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const start = () => {
    const ids = pickPracticeQuestions(logs, domains, difficulties, filter, count);
    if (ids.length === 0) return;
    startSession('practice', ids);
    router.push('/quiz');
  };

  return (
    <Screen
      inTabs
      footer={
        <>
          <Text style={s.summary}>
            {willAsk > 0 ? `${willAsk} 問を出題します` : '条件に合う問題がありません'}
          </Text>
          <Button label="演習を始める" icon="play" onPress={start} disabled={willAsk === 0} />
        </>
      }
    >
      <SectionTitle>分野</SectionTitle>
      <Card style={{ gap: 8 }}>
        {DOMAINS.map((d) => {
          const on = domains.includes(d.key);
          return (
            <Text
              key={d.key}
              onPress={() => toggleDomain(d.key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              style={[s.domain, on && s.domainOn]}
            >
              {on ? '✓ ' : '　 '}
              {d.label}
              <Text style={s.weight}>  配点 {Math.round(d.weight * 100)}%</Text>
            </Text>
          );
        })}
      </Card>

      <SectionTitle>難易度</SectionTitle>
      <View style={s.chips}>
        {LEVELS.map((l) => (
          <Chip key={String(l.key)} label={l.label} selected={level === l.key} onPress={() => setLevel(l.key)} />
        ))}
      </View>
      <Text style={s.levelDesc}>{LEVELS.find((l) => l.key === level)?.desc}</Text>

      <SectionTitle>問題数</SectionTitle>
      <View style={s.chips}>
        {COUNTS.map((n) => (
          <Chip key={n} label={`${n} 問`} selected={count === n} onPress={() => setCount(n)} />
        ))}
      </View>

      <SectionTitle>出題範囲</SectionTitle>
      <View style={s.chips}>
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  domain: {
    fontSize: 14.5,
    color: colors.sub,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  domainOn: { color: colors.navy, fontWeight: '700', borderColor: colors.navy, backgroundColor: '#EEF2FA' },
  weight: { fontSize: 12, color: colors.sub, fontWeight: '400' },
  levelDesc: { fontSize: 13, color: colors.sub, marginTop: -6 },
  summary: { fontSize: 13, color: colors.sub, textAlign: 'center' },
});
