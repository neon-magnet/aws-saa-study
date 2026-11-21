import { StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import { QUESTIONS } from '@/data/questions';
import { colors, DOMAINS, PASS_SCORE } from '@/lib/constants';
import {
  domainStats,
  latestByQuestion,
  MIN_ANSWERED_FOR_PREDICTION,
  predictedScore,
  streakDays,
  weakServices,
} from '@/lib/stats';
import { useStudyStore } from '@/store/useStudyStore';

export default function ProgressScreen() {
  const logs = useStudyStore((s) => s.logs);

  const stats = domainStats(logs);
  const score = predictedScore(logs);
  const uniqueAnswered = latestByQuestion(logs).size;
  const weak = weakServices(logs);

  return (
    <Screen>
      <View style={s.hero}>
        <Text style={s.heroLabel}>合格予測スコア（目安）</Text>
        {score == null ? (
          <Text style={s.heroNote}>
            あと {Math.max(0, MIN_ANSWERED_FOR_PREDICTION - uniqueAnswered)} 問解くと表示されます
          </Text>
        ) : (
          <>
            <Text style={s.heroBig}>
              {score}
              <Text style={s.heroUnit}> / 1000</Text>
            </Text>
            <Text style={[s.heroNote, { color: score >= PASS_SCORE ? '#7BE0A8' : colors.orange }]}>
              {score >= PASS_SCORE ? '合格ライン（720）を超えています' : `合格ライン（720）まであと ${PASS_SCORE - score}`}
            </Text>
          </>
        )}
      </View>

      <View style={s.kpis}>
        <Kpi label="累計回答" value={logs.length} unit="回" />
        <Kpi label="解いた問題" value={uniqueAnswered} unit={`/ ${QUESTIONS.length}`} />
        <Kpi label="連続学習" value={streakDays(logs)} unit="日" />
      </View>

      <SectionTitle>分野別の正答率</SectionTitle>
      <Card style={{ gap: 14 }}>
        {stats.map((d) => {
          const meta = DOMAINS.find((x) => x.key === d.domain)!;
          return (
            <View key={d.domain} style={{ gap: 5 }}>
              <View style={s.rowBetween}>
                <Text style={s.label}>
                  {meta.short}
                  <Text style={s.small}>  配点 {Math.round(meta.weight * 100)}%</Text>
                </Text>
                <Text style={s.value}>{d.rate == null ? '未回答' : `${Math.round(d.rate * 100)}%`}</Text>
              </View>
              <ProgressBar
                value={d.rate ?? 0}
                color={d.rate != null && d.rate >= 0.72 ? colors.correct : colors.orange}
              />
              <Text style={s.small}>
                {d.answered} / {d.total} 問を回答
              </Text>
            </View>
          );
        })}
      </Card>

      <SectionTitle>苦手なサービス</SectionTitle>
      <Card style={{ gap: 8 }}>
        {weak.length === 0 ? (
          <Text style={s.small}>まだありません。前回不正解の問題があるサービスがここに並びます。</Text>
        ) : (
          weak.map((w, i) => (
            <View key={w.service} style={s.rowBetween}>
              <Text style={s.label}>
                {i + 1}. {w.service}
              </Text>
              <Text style={s.value}>
                不正解 {w.wrong} / {w.answered}
              </Text>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

function Kpi({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View style={s.kpi}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text style={s.kpiValue}>
        {value}
        <Text style={s.kpiUnit}> {unit}</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 16, padding: 18, gap: 4 },
  heroLabel: { color: '#C9D3E6', fontSize: 13, fontWeight: '600' },
  heroBig: { color: '#fff', fontSize: 38, fontWeight: '800' },
  heroUnit: { fontSize: 15, fontWeight: '600' },
  heroNote: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 4 },
  kpis: { flexDirection: 'row', gap: 8 },
  kpi: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  kpiLabel: { fontSize: 12, color: colors.sub, fontWeight: '600' },
  kpiValue: { fontSize: 22, fontWeight: '800', color: colors.navy, marginTop: 2 },
  kpiUnit: { fontSize: 12, fontWeight: '600', color: colors.sub },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 14.5, color: colors.text, fontWeight: '600' },
  value: { fontSize: 14, fontWeight: '700', color: colors.text },
  small: { fontSize: 12, color: colors.sub, fontWeight: '400' },
});
