// CABテストの種類
export type ExamType = "arithmetic" | "sequence" | "command" | "cipher";

// 共通の問題インターフェース
export interface BaseQuestion {
  id: number;
  type: ExamType;
  choices: number[] | string[]; // 全問題が選択式
}

// 四則逆算: □ op B = C の形式
export interface ArithmeticQuestion extends BaseQuestion {
  type: "arithmetic";
  operator: "+" | "-" | "×" | "÷";
  b: number;
  answer: number; // 正解の□の値
  displayStr: string; // 例: "□ + 3 = 7"
  choices: number[];
}

// 法則性: 数列の次の数を答える
export interface SequenceQuestion extends BaseQuestion {
  type: "sequence";
  sequence: number[];
  answer: number;
  choices: number[];
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
  steps: string[];
  answer: number;
  choices: number[];
}

// 暗号: 記号↔文字の対応表を使う
export interface CipherQuestion extends BaseQuestion {
  type: "cipher";
  table: Record<string, string>; // 記号 → 文字
  encoded: string[];
  answer: string;
  choices: string[];
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

// 本番CABの制限時間に合わせた設定
export const EXAM_TIME_LIMITS: Record<ExamType, number> = {
  arithmetic: 9 * 60 * 1000,  // 9分
  sequence:   12 * 60 * 1000, // 12分
  command:    15 * 60 * 1000, // 15分
  cipher:     16 * 60 * 1000, // 16分
};

export const EXAM_QUESTION_COUNT: Record<ExamType, number> = {
  arithmetic: 50,
  sequence:   30,
  command:    36,
  cipher:     30,
};

export const EXAM_DESCRIPTIONS: Record<ExamType, string> = {
  arithmetic: "計算式の□に入る数字を選んでください",
  sequence:   "数列の規則を見つけ、□に入る数字を選んでください",
  command:    "命令表に従って処理した最終的な数値を選んでください",
  cipher:     "暗号表をもとに、記号が表す言葉を選んでください",
};
