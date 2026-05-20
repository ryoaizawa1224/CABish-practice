// 各テストの問題型は generators から re-export
import type { ArithmeticQuestion } from "@/lib/generators/arithmetic";
import type { SequenceQuestion } from "@/lib/generators/sequence";
import type { CommandQuestion } from "@/lib/generators/command";
import type { CipherQuestion } from "@/lib/generators/cipher";

export type { ArithmeticQuestion, SequenceQuestion, CommandQuestion, CipherQuestion };

export type ExamType = "arithmetic" | "sequence" | "command" | "cipher";

export type Question =
  | ArithmeticQuestion
  | SequenceQuestion
  | CommandQuestion
  | CipherQuestion;

// セッション結果
export interface ExamResult {
  type: ExamType;
  total: number;
  correct: number;
  timeTakenMs: number;
  answers: {
    questionId: number;
    userChoiceIndex: number | null; // null = 未回答（時間切れ）
    correctChoiceIndex: number;
    correct: boolean;
  }[];
}

export const EXAM_LABELS: Record<ExamType, string> = {
  arithmetic: "四則逆算",
  sequence:   "法則性",
  command:    "命令表",
  cipher:     "暗号",
};

// 本番CABの制限時間
export const EXAM_TIME_LIMITS: Record<ExamType, number> = {
  arithmetic: 9  * 60 * 1000,
  sequence:   12 * 60 * 1000,
  command:    15 * 60 * 1000,
  cipher:     16 * 60 * 1000,
};

export const EXAM_QUESTION_COUNT: Record<ExamType, number> = {
  arithmetic: 50,
  sequence:   30,
  command:    36,
  cipher:     30,
};

export const EXAM_DESCRIPTIONS: Record<ExamType, string> = {
  arithmetic: "計算式の□に入る数字を5つの選択肢から選んでください",
  sequence:   "5つの図形の規則性を見抜き、6番目に来る図形を選んでください",
  command:    "命令を順に適用したときの図形列の最終形を選んでください",
  cipher:     "ヒント例から暗号の意味を推論し、新しい入力の変換結果を選んでください",
};
