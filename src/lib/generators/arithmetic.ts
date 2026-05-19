import { ArithmeticQuestion } from "@/types";

type Op = "+" | "-" | "×" | "÷";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
      box = rand(1, 99);
      b = rand(1, box); // box >= b で結果が正になるように
      result = box - b;
      break;
    case "×":
      box = rand(1, 12);
      b = rand(1, 12);
      result = box * b;
      break;
    case "÷":
      // 割り切れるように生成
      box = rand(1, 12);
      b = rand(1, 12);
      result = box; // □ ÷ b = result → □ = result * b
      const actual = box * b;
      return {
        id,
        type: "arithmetic",
        operator: "÷",
        b,
        answer: actual,
        displayStr: `□ ÷ ${b} = ${box}`,
      };
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
  };
}

export function generateArithmeticQuestions(count: number): ArithmeticQuestion[] {
  return Array.from({ length: count }, (_, i) => generateArithmeticQuestion(i + 1));
}
