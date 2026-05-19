import { CipherQuestion } from "@/types";

const ALL_SYMBOLS = ["☆", "★", "◎", "○", "●", "△", "▲", "□", "■", "◇", "◆", "♪", "✿", "❀", "✦", "⊕"];
const WORDS = [
  "あめ", "うみ", "そら", "やま", "かわ", "はな", "きし", "もり",
  "つき", "ほし", "あき", "なつ", "ふゆ", "はる", "とり", "いぬ",
  "ねこ", "さる", "くま", "うさ", "きつ", "しか", "かめ", "へび",
];

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

export function generateCipherQuestion(id: number): CipherQuestion {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const chars = word.split("");
  const usedSymbols = shuffle(ALL_SYMBOLS).slice(0, chars.length);

  const table: Record<string, string> = {};
  chars.forEach((c, i) => { table[usedSymbols[i]] = c; });

  const decoys = shuffle(WORDS.filter((w) => w !== word)).slice(0, 3);
  const choices = shuffle([word, ...decoys]);

  return {
    id,
    type: "cipher",
    table,
    encoded: usedSymbols,
    answer: word,
    choices,
  };
}

export function generateCipherQuestions(count: number): CipherQuestion[] {
  return Array.from({ length: count }, (_, i) => generateCipherQuestion(i + 1));
}
