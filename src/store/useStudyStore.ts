import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { questionById } from '@/data/questions';
import { toYmd } from '@/lib/date';
import { applySm2, newReviewState, toQuality } from '@/lib/sm2';
import type { AnswerLog, ReviewState, Session, StudyMode } from '@/types';

type Settings = {
  examDate: string | null; // YYYY-MM-DD
  dailyGoal: number; // 1日の目標問題数
};

type StudyState = {
  logs: AnswerLog[];
  reviews: Record<string, ReviewState>;
  settings: Settings;
  session: Session | null;

  startSession: (mode: StudyMode, questionIds: string[]) => void;
  answerCurrent: (selectedIds: string[], confident: boolean) => void;
  nextQuestion: () => void;
  endSession: () => void;
  toggleBookmark: (questionId: string) => void;
  setMemo: (questionId: string, memo: string) => void;
  setExamDate: (date: string | null) => void;
  setDailyGoal: (n: number) => void;
  resetAll: () => void;
};

const uuid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((x) => b.includes(x));

// 保存先が使えない環境（一部のブラウザ等）でもアプリが落ちないようにする
const safeStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      /* noop */
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      /* noop */
    }
  },
};

const initial = {
  logs: [] as AnswerLog[],
  reviews: {} as Record<string, ReviewState>,
  settings: { examDate: null, dailyGoal: 10 } as Settings,
  session: null as Session | null,
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      ...initial,

      startSession: (mode, questionIds) => {
        const now = new Date().toISOString();
        set({
          session: {
            mode,
            question_ids: questionIds,
            index: 0,
            answers: [],
            started_at: now,
            question_started_at: now,
          },
        });
      },

      answerCurrent: (selectedIds, confident) => {
        const { session, reviews, logs } = get();
        if (!session) return;
        const qid = session.question_ids[session.index];
        const q = questionById(qid);
        if (!q || session.answers.some((a) => a.question_id === qid)) return;

        const isCorrect = sameSet(selectedIds, q.answer_ids);
        const elapsed = Math.max(
          1,
          Math.round((Date.now() - Date.parse(session.question_started_at)) / 1000),
        );
        const log: AnswerLog = {
          id: uuid(),
          question_id: qid,
          selected_ids: selectedIds,
          is_correct: isCorrect,
          confident,
          elapsed_sec: elapsed,
          mode: session.mode,
          answered_at: new Date().toISOString(),
        };
        const prev = reviews[qid] ?? newReviewState(qid);
        const next = applySm2(prev, toQuality(isCorrect, confident), toYmd());

        set({
          logs: [...logs, log],
          reviews: { ...reviews, [qid]: next },
          session: {
            ...session,
            answers: [
              ...session.answers,
              { question_id: qid, selected_ids: selectedIds, is_correct: isCorrect, confident },
            ],
          },
        });
      },

      nextQuestion: () => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            index: Math.min(session.index + 1, session.question_ids.length - 1),
            question_started_at: new Date().toISOString(),
          },
        });
      },

      endSession: () => set({ session: null }),

      toggleBookmark: (questionId) => {
        const { reviews } = get();
        const prev = reviews[questionId] ?? newReviewState(questionId);
        set({ reviews: { ...reviews, [questionId]: { ...prev, bookmarked: !prev.bookmarked } } });
      },

      setMemo: (questionId, memo) => {
        const { reviews } = get();
        const prev = reviews[questionId] ?? newReviewState(questionId);
        set({ reviews: { ...reviews, [questionId]: { ...prev, memo } } });
      },

      setExamDate: (date) => set({ settings: { ...get().settings, examDate: date } }),
      setDailyGoal: (n) => set({ settings: { ...get().settings, dailyGoal: n } }),
      resetAll: () => set({ ...initial }),
    }),
    {
      name: 'aws-saa-study',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({
        logs: s.logs,
        reviews: s.reviews,
        settings: s.settings,
        session: s.session,
      }),
    },
  ),
);
