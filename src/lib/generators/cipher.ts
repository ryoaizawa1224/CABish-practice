import { CipherQuestion } from "@/types";

// 記号一覧
const ALL_SYMBOLS = ["☆", "★", "◎", "○", "●", "△", "▲", "□", "■", "◇", "◆", "♪", "♦", "✿", "❀", "✦"];
// ひらがな一覧（3〜4文字の単語用）
const WORDS = [
  "あめ", "うみ", "そら", "やま", "かわ", "はな", "きし", "もり",
  "つき", "ほし", "あき", "なつ", "ふゆ", "はる", "とり", "いぬ",
];

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

export function generateCipherQuestion(id: number): CipherQuestion {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const chars = word.split("");
  const usedSymbols = shuffle(ALL_SYMBOLS).slice(0, chars.length);

  // 記号→文字のテーブル
  const table: Record<string, string> = {};
  chars.forEach((c, i) => {
    table[usedSymbols[i]] = c;
  });

  const encoded = usedSymbols;

  // 4択（正解1つ＋3つのデコイ）
  const decoys = shuffle(WORDS.filter((w) => w !== word)).slice(0, 3);
  const choices = shuffle([word, ...decoys]);

  return {
    id,
    type: "cipher",
    table,
    encoded,
    answer: word,
    choices,
  };
}

export function generateCipherQuestions(count: number): CipherQuestion[] {
  return Array.from({ length: count }, (_, i) => generateCipherQuestion(i + 1));
}
