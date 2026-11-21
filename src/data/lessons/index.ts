import type { Lesson } from '@/types';
import { COST_LESSONS } from './cost';
import { PERFORMANCE_LESSONS } from './performance';
import { RESILIENT_LESSONS } from './resilient';
import { SECURE_LESSONS } from './secure';

/**
 * 教材（読み物）。分野ごとに 4 単元。
 * 各単元の questionIds が「この単元の問題を解く」で出題される。
 */
export const LESSONS: Lesson[] = [
  ...SECURE_LESSONS,
  ...RESILIENT_LESSONS,
  ...PERFORMANCE_LESSONS,
  ...COST_LESSONS,
];

const byId = new Map(LESSONS.map((l) => [l.id, l]));
export const lessonById = (id: string) => byId.get(id);

/** 問題が属する単元 */
const byQuestion = new Map<string, Lesson>();
for (const l of LESSONS) for (const q of l.questionIds) byQuestion.set(q, l);
export const lessonForQuestion = (questionId: string) => byQuestion.get(questionId);

/** まだ読んでいない最初の単元 */
export const nextUnreadLesson = (read: Record<string, string>) => LESSONS.find((l) => !read[l.id]);
