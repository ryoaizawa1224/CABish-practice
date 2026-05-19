import { ArithmeticQuestion } from "@/types";

type Op = "+" | "-" | "×" | "÷";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function makeChoices(answer: number): number[] {
  const set = new Set<number>([answer]);
  const offsets = [-3, -2, -1, 1, 2, 3, 4, 5, -4, -5];
  for (const o of shuffle(offsets)) {
    const c = answer + o;
    if (c > 0) set.add(c);
    if (set.size >= 5) break;
  }
  // 足りない場合は補完
  let extra = 1;
  while (set.size < 5) {
    set.add(answer + extra * 6);
    extra++;
  }
  return shuffle([...set]);
}

export function generateArithmeticQuestion(id: number): ArithmeticQuestion {
  const ops: Op[] = ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let box: number, b: number, result: number;

  switch (op) {
    case "+":
      box = rand(1, 99);
      b = rand(1, 99);
      result = box + b;
      break;
    case "-":
      box = rand(2, 99);
      b = rand(1, box - 1);
      result = box - b;
      break;
    case "×":
      box = rand(1, 12);
      b = rand(2, 12);
      result = box * b;
      break;
    case "÷": {
      const divisor = rand(2, 12);
      const quotient = rand(1, 12);
      box = quotient;          // □ ÷ divisor = quotient  → □ = divisor * quotient
      b = divisor;
      result = quotient;
      const actualBox = divisor * quotient;
      return {
        id,
        type: "arithmetic",
        operator: "÷",
        b,
        answer: actualBox,
        displayStr: `□ ÷ ${b} = ${result}`,
        choices: makeChoices(actualBox),
      };
    }
    default:
      box = 1; b = 1; result = 2;
  }

  return {
    id,
    type: "arithmetic",
    operator: op,
    b,
    answer: box,
    displayStr: `□ ${op} ${b} = ${result}`,
    choices: makeChoices(box),
  };
}

export function generateArithmeticQuestions(count: number): ArithmeticQuestion[] {
  return Array.from({ length: count }, (_, i) => generateArithmeticQuestion(i + 1));
}
