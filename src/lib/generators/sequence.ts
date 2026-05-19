import { SequenceQuestion } from "@/types";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type SequencePattern = {
  name: string;
  generate: () => { sequence: number[]; answer: number };
};

const patterns: SequencePattern[] = [
  {
    name: "等差数列",
    generate: () => {
      const start = rand(1, 20);
      const diff = rand(1, 10);
      const seq = Array.from({ length: 5 }, (_, i) => start + diff * i);
      return { sequence: seq.slice(0, 4), answer: seq[4] };
    },
  },
  {
    name: "等比数列",
    generate: () => {
      const start = rand(1, 5);
      const ratio = rand(2, 4);
      const seq = Array.from({ length: 5 }, (_, i) => start * Math.pow(ratio, i));
      return { sequence: seq.slice(0, 4), answer: seq[4] };
    },
  },
  {
    name: "差が等差",
    generate: () => {
      const start = rand(1, 10);
      const diffs = [rand(1, 5), 0, 0, 0];
      diffs[1] = diffs[0] + rand(1, 3);
      diffs[2] = diffs[1] + (diffs[1] - diffs[0]);
      diffs[3] = diffs[2] + (diffs[1] - diffs[0]);
      const seq = [start];
      for (let i = 0; i < 4; i++) seq.push(seq[seq.length - 1] + diffs[i]);
      return { sequence: seq.slice(0, 4), answer: seq[4] };
    },
  },
  {
    name: "交互数列",
    generate: () => {
      const a = rand(1, 20);
      const diffA = rand(1, 5);
      const b = rand(1, 20);
      const diffB = rand(1, 5);
      // a, b, a+da, b+db, a+2da, ...
      const seq = [a, b, a + diffA, b + diffB, a + diffA * 2];
      return { sequence: seq.slice(0, 4), answer: seq[4] };
    },
  },
  {
    name: "フィボナッチ型",
    generate: () => {
      const a = rand(1, 5);
      const b = rand(1, 5);
      const seq = [a, b, a + b, a + b * 2, a * 2 + b * 3];
      return { sequence: seq.slice(0, 4), answer: seq[4] };
    },
  },
];

export function generateSequenceQuestion(id: number): SequenceQuestion {
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const { sequence, answer } = pattern.generate();
  return {
    id,
    type: "sequence",
    sequence,
    answer,
  };
}

export function generateSequenceQuestions(count: number): SequenceQuestion[] {
  return Array.from({ length: count }, (_, i) => generateSequenceQuestion(i + 1));
}
