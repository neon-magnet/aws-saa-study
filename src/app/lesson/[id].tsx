import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Markdown } from '@/components/Markdown';
import { Button, Card, Screen } from '@/components/ui';
import { LESSONS, lessonById } from '@/data/lessons';
import { colors, domainShort } from '@/lib/constants';
import { latestByQuestion } from '@/lib/stats';
import { useStudyStore } from '@/store/useStudyStore';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessonById(String(id));
  const read = useStudyStore((s) => (lesson ? !!s.readLessons[lesson.id] : false));
  const logs = useStudyStore((s) => s.logs);
  const setLessonRead = useStudyStore((s) => s.setLessonRead);
  const startSession = useStudyStore((s) => s.startSession);

  if (!lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ title: '教材' }} />
        <Card>
          <Text style={s.p}>単元が見つかりませんでした。</Text>
          <Button label="教材の一覧へ" onPress={() => router.replace('/learn')} />
        </Card>
      </Screen>
    );
  }

  const index = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[index + 1];
  const latest = latestByQuestion(logs);
  const solved = lesson.questionIds.filter((q) => latest.get(q)?.is_correct).length;

  const practice = () => {
    setLessonRead(lesson.id, true);
    startSession('practice', lesson.questionIds);
    router.push('/quiz');
  };

  return (
    <Screen
      footer={
        <Button
          label={`この単元の問題を解く（${lesson.questionIds.length} 問）`}
          icon="create"
          onPress={practice}
        />
      }
    >
      <Stack.Screen options={{ title: domainShort(lesson.domain) }} />

      <View style={{ gap: 6 }}>
        <Text style={s.title}>{lesson.title}</Text>
        <Text style={s.meta}>
          約 {lesson.minutes} 分 · {lesson.services.join(' · ')}
        </Text>
      </View>

      <Markdown source={lesson.body} />

      <Card style={s.points}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="checkmark-done" size={18} color={colors.navy} />
          <Text style={s.pointsTitle}>試験で押さえるポイント</Text>
        </View>
        {lesson.keyPoints.map((p, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={s.num}>{i + 1}</Text>
            <Text style={[s.p, { flex: 1 }]}>{p}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={s.p}>
          この単元の問題：{solved} / {lesson.questionIds.length} 問 正解
        </Text>
        <Button
          label={read ? '読了済み（取り消す）' : '読了にする'}
          icon={read ? 'checkmark-circle' : 'checkmark-circle-outline'}
          variant="ghost"
          onPress={() => setLessonRead(lesson.id, !read)}
        />
        {next ? (
          <Button
            label={`次の単元：${next.title}`}
            variant="ghost"
            onPress={() => {
              setLessonRead(lesson.id, true);
              router.replace(`/lesson/${next.id}`);
            }}
          />
        ) : null}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30 },
  meta: { fontSize: 13, color: colors.sub },
  p: { fontSize: 15, lineHeight: 23, color: colors.text },
  points: { borderColor: colors.navy, borderWidth: 1.5 },
  pointsTitle: { fontSize: 15, fontWeight: '800', color: colors.navy },
  num: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.navy,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    marginTop: 1,
  },
});
