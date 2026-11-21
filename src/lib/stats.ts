import { QUESTIONS } from '@/data/questions';
import type { AnswerLog, Difficulty, Domain, Question, ReviewState } from '@/types';
import { DOMAINS } from './constants';
import { addDays, daysBetween, toYmd } from './date';

/** 問題ごとの最新の回答 */
export const latestByQuestion = (logs: AnswerLog[]) => {
  const map = new Map<string, AnswerLog>();
  for (const l of logs) map.set(l.question_id, l);
  return map;
};

/** 今日が期限の復習問題 */
export const dueQuestionIds = (reviews: Record<string, ReviewState>, today = toYmd()) =>
  QUESTIONS.filter((q) => {
    const r = reviews[q.id];
    return r?.due_date != null && r.due_date <= today;
  }).map((q) => q.id);

export type DomainStat = {
  domain: Domain;
  answered: number; // 解いた問題数（重複なし）
  correct: number; // 最新の回答で正解している問題数
  total: number; // 収録問題数
  rate: number | null; // 正答率（0〜1）
};

export const domainStats = (logs: AnswerLog[]): DomainStat[] => {
  const latest = latestByQuestion(logs);
  return DOMAINS.map(({ key }) => {
    const qs = QUESTIONS.filter((q) => q.domain === key);
    let answered = 0;
    let correct = 0;
    for (const q of qs) {
      const l = latest.get(q.id);
      if (!l) continue;
      answered += 1;
      if (l.is_correct) correct += 1;
    }
    return { domain: key, answered, correct, total: qs.length, rate: answered ? correct / answered : null };
  });
};

/** 合格予測スコア（配点で加重した正答率を 1000 点満点に換算）。データ不足なら null */
export const MIN_ANSWERED_FOR_PREDICTION = Math.min(20, QUESTIONS.length);

export const predictedScore = (logs: AnswerLog[]) => {
  const stats = domainStats(logs);
  const answered = stats.reduce((s, d) => s + d.answered, 0);
  if (answered < MIN_ANSWERED_FOR_PREDICTION) return null;
  let wSum = 0;
  let score = 0;
  for (const d of stats) {
    if (d.rate == null) continue;
    const w = DOMAINS.find((x) => x.key === d.domain)!.weight;
    wSum += w;
    score += w * d.rate;
  }
  if (wSum === 0) return null;
  return Math.round((score / wSum) * 1000);
};

/** 連続学習日数（今日または昨日まで続いている日数） */
export const streakDays = (logs: AnswerLog[], today = toYmd()) => {
  const days = new Set(logs.map((l) => toYmd(new Date(l.answered_at))));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(cursor)) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
};

export const answeredToday = (logs: AnswerLog[], today = toYmd()) =>
  logs.filter((l) => toYmd(new Date(l.answered_at)) === today).length;

export const daysUntilExam = (examDate: string | null, today = toYmd()) =>
  examDate ? daysBetween(today, examDate) : null;

/** 苦手サービス（最新回答が不正解の問題が多い順） */
export const weakServices = (logs: AnswerLog[], limit = 5) => {
  const latest = latestByQuestion(logs);
  const count = new Map<string, { wrong: number; answered: number }>();
  for (const q of QUESTIONS) {
    const l = latest.get(q.id);
    if (!l) continue;
    for (const s of q.services) {
      const c = count.get(s) ?? { wrong: 0, answered: 0 };
      c.answered += 1;
      if (!l.is_correct) c.wrong += 1;
      count.set(s, c);
    }
  }
  return [...count.entries()]
    .filter(([, c]) => c.wrong > 0)
    .sort((a, b) => b[1].wrong / b[1].answered - a[1].wrong / a[1].answered || b[1].wrong - a[1].wrong)
    .slice(0, limit)
    .map(([service, c]) => ({ service, ...c }));
};

export type PracticeFilter = 'all' | 'unanswered' | 'wrong';

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const pickPracticeQuestions = (
  logs: AnswerLog[],
  domains: Domain[],
  difficulties: Difficulty[],
  filter: PracticeFilter,
  count: number,
): string[] => {
  const latest = latestByQuestion(logs);
  const pool = QUESTIONS.filter((q: Question) => {
    if (!domains.includes(q.domain)) return false;
    if (!difficulties.includes(q.difficulty)) return false;
    const l = latest.get(q.id);
    if (filter === 'unanswered') return !l;
    if (filter === 'wrong') return !!l && !l.is_correct;
    return true;
  });
  return shuffle(pool)
    .slice(0, count)
    .map((q) => q.id);
};

export const countPool = (
  logs: AnswerLog[],
  domains: Domain[],
  difficulties: Difficulty[],
  filter: PracticeFilter,
) => pickPracticeQuestions(logs, domains, difficulties, filter, Number.MAX_SAFE_INTEGER).length;
