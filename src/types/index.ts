// CABテストの種類
export type ExamType = "arithmetic" | "sequence" | "command" | "cipher";

// 共通の問題インターフェース
export interface BaseQuestion {
  id: number;
  type: ExamType;
}

// 四則逆算: □ op B = C の形式
export interface ArithmeticQuestion extends BaseQuestion {
  type: "arithmetic";
  operator: "+" | "-" | "×" | "÷";
  // □ operator b = answer  (□を求める)
  b: number;
  answer: number; // 正解の□の値
  displayStr: string; // 例: "□ + 3 = 7"
}

// 法則性: 数列の次の数を答える
export interface SequenceQuestion extends BaseQuestion {
  type: "sequence";
  sequence: number[]; // 表示する数列（最後が□）
  answer: number;
}

// 命令表: 記号→操作のマッピングと初期値
export interface CommandRule {
  symbol: string;
  operation: "add" | "sub" | "mul" | "div";
  value: number;
}

export interface CommandQuestion extends BaseQuestion {
  type: "command";
  rules: CommandRule[];
  initialValue: number;
  steps: string[]; // 記号の列
  answer: number;
}

// 暗号: 記号↔文字の対応表を使う
export interface CipherQuestion extends BaseQuestion {
  type: "cipher";
  table: Record<string, string>; // 記号 → 文字
  encoded: string[]; // 記号の配列
  answer: string; // 正解の文字列
  choices: string[]; // 4択
}

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
    question: Question;
    userAnswer: string;
    correct: boolean;
  }[];
}

export const EXAM_LABELS: Record<ExamType, string> = {
  arithmetic: "四則逆算",
  sequence: "法則性",
  command: "命令表",
  cipher: "暗号",
};

export const EXAM_TIME_LIMITS: Record<ExamType, number> = {
  arithmetic: 10 * 60 * 1000, // 10分
  sequence: 10 * 60 * 1000,
  command: 10 * 60 * 1000,
  cipher: 10 * 60 * 1000,
};

export const EXAM_QUESTION_COUNT: Record<ExamType, number> = {
  arithmetic: 50,
  sequence: 30,
  command: 20,
  cipher: 20,
};
