import type { ReviewState } from '@/types';
import { addDays } from './date';

/**
 * 回答結果を SM-2 の評価値（0〜5）に変換する
 * - 不正解: 1
 * - 正解・自信なし: 3
 * - 正解・自信あり: 5
 */
export const toQuality = (isCorrect: boolean, confident: boolean) =>
  !isCorrect ? 1 : confident ? 5 : 3;

export const newReviewState = (questionId: string): ReviewState => ({
  question_id: questionId,
  ease: 2.5,
  interval_days: 0,
  repetitions: 0,
  due_date: null,
  bookmarked: false,
  memo: '',
});

export const applySm2 = (state: ReviewState, quality: number, today: string): ReviewState => {
  let { ease, interval_days, repetitions } = state;
  if (quality < 3) {
    repetitions = 0;
    interval_days = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval_days = 1;
    else if (repetitions === 2) interval_days = 6;
    else interval_days = Math.round(interval_days * ease);
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return {
    ...state,
    ease: Math.round(ease * 100) / 100,
    interval_days,
    repetitions,
    due_date: addDays(today, interval_days),
  };
};
