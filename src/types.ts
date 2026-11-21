export type Domain = 'secure' | 'resilient' | 'performance' | 'cost';

export type Difficulty = 1 | 2;

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
  difficulty: Difficulty; // 1: 基礎 / 2: 応用
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

/** 教材の単元 */
export type Lesson = {
  id: string; // 例: L-SEC-01
  domain: Domain;
  title: string;
  summary: string; // 一覧に出す1〜2文の説明
  minutes: number; // 読む目安（分）
  services: string[];
  /**
   * 本文（簡易Markdown）
   * - 「## 見出し」「### 小見出し」
   * - 「- 箇条書き」
   * - 「> ポイント」（強調枠）
   * - 「| 表 | 表 |」（1行目が見出し、2行目は区切り行）
   * - 行内の **太字** と `コード`
   */
  body: string;
  keyPoints: string[]; // 試験で押さえるポイント
  questionIds: string[]; // この単元で演習する問題
};
