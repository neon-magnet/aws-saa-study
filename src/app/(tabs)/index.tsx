import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, ListRow, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import { LESSONS, nextUnreadLesson } from '@/data/lessons';
import { QUESTIONS } from '@/data/questions';
import { colors } from '@/lib/constants';
import { answeredToday, daysUntilExam, dueQuestionIds, streakDays } from '@/lib/stats';
import { useStudyStore } from '@/store/useStudyStore';

export default function HomeScreen() {
  const logs = useStudyStore((s) => s.logs);
  const reviews = useStudyStore((s) => s.reviews);
  const settings = useStudyStore((s) => s.settings);
  const session = useStudyStore((s) => s.session);
  const startSession = useStudyStore((s) => s.startSession);
  const readLessons = useStudyStore((s) => s.readLessons);
  const nextLesson = nextUnreadLesson(readLessons);
  const readCount = LESSONS.filter((l) => readLessons[l.id]).length;

  const due = dueQuestionIds(reviews);
  const today = answeredToday(logs);
  const streak = streakDays(logs);
  const left = daysUntilExam(settings.examDate);
  const bookmarks = Object.values(reviews).filter((r) => r.bookmarked).length;
  const unfinished =
    session && session.answers.length < session.question_ids.length ? session : null;

  return (
    <Screen>
      <View style={s.hero}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={s.heroLabel}>試験まで</Text>
            {left == null ? (
              <Text style={s.heroLink} onPress={() => router.navigate('/settings')}>
                受験日を設定する
              </Text>
            ) : (
              <Text style={s.heroBig}>
                {left >= 0 ? left : '—'}
                <Text style={s.heroUnit}> 日</Text>
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.heroLabel}>連続学習</Text>
            <Text style={s.heroBig}>
              {streak}
              <Text style={s.heroUnit}> 日</Text>
            </Text>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={s.heroLabel}>
            今日の学習 {today} / {settings.dailyGoal} 問
          </Text>
          <ProgressBar value={today / Math.max(1, settings.dailyGoal)} />
        </View>
      </View>

      {unfinished ? (
        <Card>
          <Text style={s.cardTitle}>途中の学習があります</Text>
          <Text style={s.cardSub}>
            {unfinished.answers.length} / {unfinished.question_ids.length} 問 回答済み
          </Text>
          <Button label="続きから" icon="play" onPress={() => router.push('/quiz')} />
        </Card>
      ) : null}

      {nextLesson ? (
        <Card>
          <Text style={s.cardSub}>次に読む単元（{readCount} / {LESSONS.length} 読了）</Text>
          <Text style={s.cardTitle}>{nextLesson.title}</Text>
          <Text style={s.cardSub}>{nextLesson.summary}</Text>
          <Button
            label="読む"
            icon="reader"
            variant="secondary"
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
          />
        </Card>
      ) : null}

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={s.cardTitle}>今日の復習</Text>
          <Text style={s.count}>
            {due.length}
            <Text style={s.countUnit}> 問</Text>
          </Text>
        </View>
        <Text style={s.cardSub}>
          {due.length > 0
            ? '間違えた問題・自信がなかった問題が復習のタイミングです'
            : '今日の復習はありません。新しい問題に進みましょう'}
        </Text>
        <Button
          label="復習を始める"
          icon="refresh"
          variant="secondary"
          disabled={due.length === 0}
          onPress={() => {
            startSession('review', due);
            router.push('/quiz');
          }}
        />
      </Card>

      <SectionTitle>学習メニュー</SectionTitle>
      <Card style={{ gap: 4 }}>
        <ListRow
          icon="reader"
          title="教材"
          sub="出題範囲を分野ごとに読んで学ぶ"
          right={`${readCount}/${LESSONS.length}`}
          onPress={() => router.navigate('/learn')}
        />
        <ListRow
          icon="book"
          title="問題演習"
          sub={`分野・問題数を選んで解く（収録 ${QUESTIONS.length} 問）`}
          onPress={() => router.navigate('/study')}
        />
        <ListRow
          icon="bookmark"
          title="ブックマーク"
          sub="保存した問題を解き直す"
          right={String(bookmarks)}
          onPress={() => router.push('/bookmarks')}
        />
        <ListRow icon="stats-chart" title="進捗" sub="分野別の正答率と合格予測" onPress={() => router.navigate('/progress')} />
        <ListRow icon="timer" title="模擬試験" sub="65問・130分の本番形式（次の段階で追加予定）" />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 16, padding: 18, gap: 16 },
  heroLabel: { color: '#C9D3E6', fontSize: 13, fontWeight: '600' },
  heroBig: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 2 },
  heroUnit: { fontSize: 15, fontWeight: '600' },
  heroLink: { color: colors.orange, fontSize: 16, fontWeight: '700', marginTop: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 13, color: colors.sub, lineHeight: 19 },
  count: { fontSize: 28, fontWeight: '800', color: colors.navy },
  countUnit: { fontSize: 14, fontWeight: '600' },
});
