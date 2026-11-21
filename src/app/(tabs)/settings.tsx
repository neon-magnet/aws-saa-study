import Constants from 'expo-constants';
import { useState } from 'react';
import { Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, Chip, Screen, SectionTitle } from '@/components/ui';
import { colors } from '@/lib/constants';
import { isValidYmd } from '@/lib/date';
import { useStudyStore } from '@/store/useStudyStore';

const GOALS = [5, 10, 20, 30];

export default function SettingsScreen() {
  const settings = useStudyStore((s) => s.settings);
  const setExamDate = useStudyStore((s) => s.setExamDate);
  const setDailyGoal = useStudyStore((s) => s.setDailyGoal);
  const resetAll = useStudyStore((s) => s.resetAll);

  const [dateText, setDateText] = useState(settings.examDate ?? '');
  const [dateMsg, setDateMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const saveDate = () => {
    const t = dateText.trim();
    if (t === '') {
      setExamDate(null);
      setDateMsg('受験日を未設定にしました');
      return;
    }
    if (!isValidYmd(t)) {
      setDateMsg('「2026-12-20」の形式で入力してください');
      return;
    }
    setExamDate(t);
    setDateMsg('保存しました');
  };

  const exportData = async () => {
    const { logs, reviews, settings: st } = useStudyStore.getState();
    const json = JSON.stringify({ exported_at: new Date().toISOString(), logs, reviews, settings: st }, null, 2);
    try {
      await Share.share({ message: json, title: 'AWS SAA学習アプリ 学習データ' });
      setExportMsg(null);
    } catch {
      setExportMsg('この環境では共有できませんでした');
    }
  };

  return (
    <Screen>
      <SectionTitle>受験日</SectionTitle>
      <Card>
        <Text style={s.help}>ホームに残り日数を表示します（例：2026-12-20）</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={dateText}
            onChangeText={(t) => {
              setDateText(t);
              setDateMsg(null);
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.sub}
            keyboardType="numbers-and-punctuation"
            style={s.input}
          />
          <Button label="保存" variant="secondary" onPress={saveDate} style={{ minWidth: 80 }} />
        </View>
        {dateMsg ? <Text style={s.help}>{dateMsg}</Text> : null}
      </Card>

      <SectionTitle>1日の目標問題数</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {GOALS.map((g) => (
          <Chip key={g} label={`${g} 問`} selected={settings.dailyGoal === g} onPress={() => setDailyGoal(g)} />
        ))}
      </View>

      <SectionTitle>データ</SectionTitle>
      <Card>
        <Button label="学習データを書き出す（JSON）" icon="share-outline" variant="ghost" onPress={exportData} />
        {exportMsg ? <Text style={s.help}>{exportMsg}</Text> : null}
        <Button
          label={confirmReset ? 'もう一度押すとすべて削除します' : '学習データをリセット'}
          icon="trash-outline"
          variant="ghost"
          onPress={() => {
            if (!confirmReset) return setConfirmReset(true);
            resetAll();
            setDateText('');
            setConfirmReset(false);
          }}
          style={confirmReset ? { borderColor: colors.wrong } : undefined}
        />
      </Card>

      <Text style={s.version}>
        AWS SAA学習アプリ v{Constants.expoConfig?.version ?? '1.0.0'}（SAA-C03 対応）
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  help: { fontSize: 13, color: colors.sub },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
  },
  version: { fontSize: 12, color: colors.sub, textAlign: 'center', marginTop: 8 },
});
