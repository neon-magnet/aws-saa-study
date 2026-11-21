import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, TextInput, View, type ScrollViewInstance } from 'react-native';
import { Button, Card, ProgressBar, RichText, Screen } from '@/components/ui';
import { questionById } from '@/data/questions';
import { colors, domainShort } from '@/lib/constants';
import { useStudyStore } from '@/store/useStudyStore';
import type { Question } from '@/types';

export default function QuizScreen() {
  const session = useStudyStore((s) => s.session);

  if (!session) {
    return (
      <Screen>
        <Card>
          <Text style={s.stem}>進行中の学習はありません。</Text>
          <Button label="ホームへ" onPress={() => router.replace('/')} />
        </Card>
      </Screen>
    );
  }

  const qid = session.question_ids[session.index];
  const q = questionById(qid);
  if (!q) {
    return (
      <Screen>
        <Card>
          <Text style={s.stem}>問題が見つかりませんでした（{qid}）。</Text>
          <Button label="ホームへ" onPress={() => router.replace('/')} />
        </Card>
      </Screen>
    );
  }
  // 問題が変わったら選択状態をリセットするため key を付ける
  return <QuestionView key={`${session.started_at}-${qid}`} q={q} />;
}

function QuestionView({ q }: { q: Question }) {
  const session = useStudyStore((s) => s.session)!;
  const review = useStudyStore((s) => s.reviews[q.id]);
  const answerCurrent = useStudyStore((s) => s.answerCurrent);
  const nextQuestion = useStudyStore((s) => s.nextQuestion);
  const toggleBookmark = useStudyStore((s) => s.toggleBookmark);
  const setMemo = useStudyStore((s) => s.setMemo);

  const answered = session.answers.find((a) => a.question_id === q.id);
  const [selected, setSelected] = useState<string[]>(answered?.selected_ids ?? []);
  const [memo, setMemoText] = useState(review?.memo ?? '');
  const scrollRef = useRef<ScrollViewInstance>(null);
  const verdictY = useRef<number | null>(null);
  const justAnswered = useRef(false);

  const need = q.type === 'multiple' ? q.answer_ids.length : 1;
  const total = session.question_ids.length;
  const isLast = session.index === total - 1;
  const done = session.answers.length;

  const toggle = (id: string) => {
    if (answered) return;
    if (q.type === 'single') return setSelected([id]);
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = (confident: boolean) => {
    justAnswered.current = true;
    answerCurrent(selected, confident);
  };

  // 回答直後は正誤と解説が見える位置までスクロールする
  useEffect(() => {
    if (answered && justAnswered.current && verdictY.current != null) {
      justAnswered.current = false;
      scrollRef.current?.scrollTo({ y: Math.max(0, verdictY.current - 16), animated: true });
    }
  });

  const footer = answered ? (
    isLast ? (
      <Button label="結果を見る" icon="flag" onPress={() => router.replace('/result')} />
    ) : (
      <Button label="次の問題" icon="arrow-forward" onPress={nextQuestion} />
    )
  ) : (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          label="自信なしで回答"
          variant="ghost"
          style={{ flex: 1 }}
          disabled={selected.length !== need}
          onPress={() => submit(false)}
        />
        <Button
          label="自信ありで回答"
          style={{ flex: 1 }}
          disabled={selected.length !== need}
          onPress={() => submit(true)}
        />
      </View>
    </>
  );

  return (
    <Screen footer={footer} scrollRef={scrollRef}>
      <View style={{ gap: 8 }}>
        <View style={s.metaRow}>
          <Text style={s.progressText}>
            {session.mode === 'review' ? '復習 ' : ''}
            {session.index + 1} / {total}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={review?.bookmarked ? 'ブックマークを外す' : 'ブックマークする'}
            onPress={() => toggleBookmark(q.id)}
            hitSlop={12}
          >
            <Ionicons
              name={review?.bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={review?.bookmarked ? colors.orange : colors.sub}
            />
          </Pressable>
        </View>
        <ProgressBar value={done / total} color={colors.navy} />
      </View>

      <View style={s.tags}>
        <Text style={[s.tag, s.tagDomain]}>{domainShort(q.domain)}</Text>
        {q.services.map((sv) => (
          <Text key={sv} style={s.tag}>
            {sv}
          </Text>
        ))}
      </View>

      <Text style={s.stem}>{q.stem}</Text>
      {q.type === 'multiple' ? <Text style={s.hint}>{need} つ選んでください</Text> : null}

      <View style={{ gap: 10 }}>
        {q.choices.map((c) => {
          const isSel = selected.includes(c.id);
          const isAns = q.answer_ids.includes(c.id);
          let border = isSel ? colors.navy : colors.border;
          let bg = isSel ? '#EEF2FA' : '#fff';
          let mark: keyof typeof Ionicons.glyphMap | null = null;
          if (answered) {
            if (isAns) {
              border = colors.correct;
              bg = colors.correctSoft;
              mark = 'checkmark-circle';
            } else if (isSel) {
              border = colors.wrong;
              bg = colors.wrongSoft;
              mark = 'close-circle';
            } else {
              border = colors.border;
              bg = '#fff';
            }
          }
          return (
            <Pressable
              key={c.id}
              onPress={() => toggle(c.id)}
              accessibilityRole={q.type === 'single' ? 'radio' : 'checkbox'}
              accessibilityState={{ checked: isSel, disabled: !!answered }}
              style={[s.choice, { borderColor: border, backgroundColor: bg }]}
            >
              <Text style={[s.choiceId, isSel && !answered && { color: colors.navy }]}>{c.id}</Text>
              <Text style={s.choiceText}>{c.text}</Text>
              {mark ? (
                <Ionicons name={mark} size={22} color={isAns ? colors.correct : colors.wrong} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <>
          <View
            onLayout={(e) => {
              verdictY.current = e.nativeEvent.layout.y;
              if (justAnswered.current) {
                justAnswered.current = false;
                scrollRef.current?.scrollTo({ y: Math.max(0, e.nativeEvent.layout.y - 16), animated: true });
              }
            }}
            style={[s.verdict, { backgroundColor: answered.is_correct ? colors.correctSoft : colors.wrongSoft }]}>
            <Ionicons
              name={answered.is_correct ? 'checkmark-circle' : 'close-circle'}
              size={26}
              color={answered.is_correct ? colors.correct : colors.wrong}
            />
            <View style={{ flex: 1 }}>
              <Text style={[s.verdictTitle, { color: answered.is_correct ? colors.correct : colors.wrong }]}>
                {answered.is_correct ? '正解' : '不正解'}
              </Text>
              <Text style={s.verdictSub}>
                正解は {q.answer_ids.join('、')}
                {answered.is_correct && !answered.confident ? '（自信なし → 近いうちに復習します）' : ''}
                {!answered.is_correct ? '（明日の復習に追加しました）' : ''}
              </Text>
            </View>
          </View>

          <Card>
            <Text style={s.cardTitle}>解説</Text>
            <RichText text={q.explanation} />
          </Card>

          <Card>
            <Text style={s.cardTitle}>ほかの選択肢が誤りの理由</Text>
            {q.choices
              .filter((c) => c.why_wrong)
              .map((c) => (
                <Text key={c.id} style={s.why}>
                  <Text style={{ fontWeight: '700' }}>{c.id}：</Text>
                  {c.why_wrong}
                </Text>
              ))}
          </Card>

          {q.references.length > 0 ? (
            <Card style={{ gap: 6 }}>
              <Text style={s.cardTitle}>参考ドキュメント</Text>
              {q.references.map((url) => (
                <Text
                  key={url}
                  style={s.link}
                  {...(Platform.OS === 'web'
                    ? ({ href: url, hrefAttrs: { target: '_blank', rel: 'noopener noreferrer' } } as object)
                    : { onPress: () => Linking.openURL(url).catch(() => {}) })}
                >
                  {url.replace(/^https:\/\//, '')}
                </Text>
              ))}
            </Card>
          ) : null}

          <Card>
            <Text style={s.cardTitle}>メモ</Text>
            <TextInput
              value={memo}
              onChangeText={setMemoText}
              onBlur={() => setMemo(q.id, memo)}
              onEndEditing={() => setMemo(q.id, memo)}
              placeholder="覚えておきたいことを書く"
              placeholderTextColor={colors.sub}
              multiline
              style={s.memo}
            />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { fontSize: 14, fontWeight: '700', color: colors.sub },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sub,
    backgroundColor: '#E8ECF2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tagDomain: { color: colors.navy, backgroundColor: colors.orangeSoft },
  stem: { fontSize: 16, lineHeight: 26, color: colors.text },
  hint: { fontSize: 13, fontWeight: '700', color: colors.orange },
  choice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  choiceId: { fontSize: 15, fontWeight: '800', color: colors.sub, width: 18 },
  choiceText: { flex: 1, fontSize: 15, lineHeight: 22, color: colors.text },
  verdict: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 14, borderRadius: 12 },
  verdictTitle: { fontSize: 18, fontWeight: '800' },
  verdictSub: { fontSize: 13, color: colors.text, marginTop: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.navy },
  why: { fontSize: 14, lineHeight: 21, color: colors.text },
  link: { fontSize: 13, color: '#1A5FB4', textDecorationLine: 'underline' },
  memo: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
