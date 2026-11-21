export type Domain = 'secure' | 'resilient' | 'performance' | 'cost';

export type Choice = {
  id: string; // A〜F
  text: string;
  why_wrong?: string; // 誤答である理由（正解肢は空）
};

export type Question = {
  id: string; // 例: Q-SEC-0001
  domain: Domain;
  services: string[];
  type: 'single' | 'multiple';
  stem: string;
  choices: Choice[];
  answer_ids: string[];
  explanation: string;
  references: string[];
  difficulty: 1 | 2 | 3;
  version: number;
};

export type StudyMode = 'practice' | 'review' | 'mock';

export type AnswerLog = {
  id: string;
  question_id: string;
  selected_ids: string[];
  is_correct: boolean;
  confident: boolean;
  elapsed_sec: number;
  mode: StudyMode;
  answered_at: string; // ISO
};

export type ReviewState = {
  question_id: string;
  ease: number; // SM-2 容易度（初期値 2.5）
  interval_days: number;
  repetitions: number;
  due_date: string | null; // YYYY-MM-DD（未回答なら null）
  bookmarked: boolean;
  memo: string;
};

export type SessionAnswer = {
  question_id: string;
  selected_ids: string[];
  is_correct: boolean;
  confident: boolean;
};

export type Session = {
  mode: StudyMode;
  question_ids: string[];
  index: number;
  answers: SessionAnswer[];
  started_at: string;
  question_started_at: string;
};
