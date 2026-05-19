import { SequenceQuestion } from "@/types";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function makeChoices(answer: number): number[] {
  const set = new Set<number>([answer]);
  const offsets = [-4, -3, -2, -1, 1, 2, 3, 4, 5, 6, -5, 7];
  for (const o of shuffle(offsets)) {
    const c = answer + o;
    if (c !== answer) set.add(c);
    if (set.size >= 5) break;
  }
  let extra = 10;
  while (set.size < 5) { set.add(answer + extra); extra += 5; }
  return shuffle([...set]);
}

type PatternFn = () => { sequence: number[]; answer: number };

const patterns: PatternFn[] = [
  // 等差数列
  () => {
    const s = rand(1, 20), d = rand(1, 10);
    const seq = Array.from({ length: 5 }, (_, i) => s + d * i);
    return { sequence: seq.slice(0, 4), answer: seq[4] };
  },
  // 等比数列
  () => {
    const s = rand(1, 4), r = rand(2, 3);
    const seq = Array.from({ length: 5 }, (_, i) => s * Math.pow(r, i));
    return { sequence: seq.slice(0, 4), answer: seq[4] };
  },
  // 差が等差
  () => {
    const s = rand(1, 10), d1 = rand(1, 4), dd = rand(1, 3);
    const diffs = [d1, d1 + dd, d1 + dd * 2, d1 + dd * 3];
    const seq = [s];
    for (const d of diffs) seq.push(seq[seq.length - 1] + d);
    return { sequence: seq.slice(0, 4), answer: seq[4] };
  },
  // 交互数列
  () => {
    const a = rand(2, 20), da = rand(2, 5);
    const b = rand(2, 20), db = rand(2, 5);
    const seq = [a, b, a + da, b + db, a + da * 2];
    return { sequence: seq.slice(0, 4), answer: seq[4] };
  },
  // フィボナッチ型（前2項の和）
  () => {
    const a = rand(1, 5), b = rand(1, 5);
    const seq = [a, b, a + b, a + b * 2, a * 2 + b * 3];
    return { sequence: seq.slice(0, 4), answer: seq[4] };
  },
  // 掛け算→足し算交互
  () => {
    const s = rand(1, 5), m = rand(2, 4), a = rand(1, 5);
    const seq = [s, s * m, s * m + a, (s * m + a) * m, (s * m + a) * m + a];
    return { sequence: seq.slice(0, 4), answer: seq[4] };
  },
];

export function generateSequenceQuestion(id: number): SequenceQuestion {
  const fn = patterns[Math.floor(Math.random() * patterns.length)];
  const { sequence, answer } = fn();
  return { id, type: "sequence", sequence, answer, choices: makeChoices(answer) };
}

export function generateSequenceQuestions(count: number): SequenceQuestion[] {
  return Array.from({ length: count }, (_, i) => generateSequenceQuestion(i + 1));
}
