// 四則逆算: 計算式の □ に入る数を答える
// 例: □ + 3 = 7  → 4
//
// 形式は複数:
// - □ op B = C     (□を求める)
// - A op □ = C     (□を求める)
// - 単純な計算 A op B = ?  (本物には少ないが種類を増やす)

export interface ArithmeticQuestion {
  id: number;
  type: "arithmetic";
  displayStr: string;
  answer: number;
  choices: number[];
}

type Op = "+" | "-" | "×" | "÷";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function makeChoices(answer: number): number[] {
  const set = new Set<number>([answer]);
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, -4, 5, -5, 6, -6]);
  for (const o of offsets) {
    const c = answer + o;
    if (c >= 0) set.add(c);
    if (set.size >= 5) break;
  }
  let extra = 7;
  while (set.size < 5) {
    set.add(Math.abs(answer + extra));
    extra++;
  }
  return shuffle([...set]);
}

interface Generated {
  displayStr: string;
  answer: number;
}

// パターン1: □ op B = C
function patternBoxFirst(): Generated {
  const op = (["+", "-", "×", "÷"] as Op[])[Math.floor(Math.random() * 4)];
  let box: number, b: number, result: number;
  switch (op) {
    case "+":
      box = rand(1, 99); b = rand(1, 99); result = box + b; break;
    case "-":
      box = rand(2, 99); b = rand(1, box - 1); result = box - b; break;
    case "×":
      box = rand(1, 12); b = rand(2, 12); result = box * b; break;
    case "÷": {
      const divisor = rand(2, 12);
      const quotient = rand(1, 12);
      box = divisor * quotient;
      b = divisor;
      result = quotient;
      break;
    }
  }
  return { displayStr: `□ ${op} ${b} = ${result}`, answer: box };
}

// パターン2: A op □ = C
function patternBoxSecond(): Generated {
  const op = (["+", "-", "×", "÷"] as Op[])[Math.floor(Math.random() * 4)];
  let a: number, box: number, result: number;
  switch (op) {
    case "+":
      a = rand(1, 99); box = rand(1, 99); result = a + box; break;
    case "-":
      a = rand(10, 99); box = rand(1, a - 1); result = a - box; break;
    case "×":
      a = rand(2, 12); box = rand(1, 12); result = a * box; break;
    case "÷": {
      const divisor = rand(2, 12);
      const quotient = rand(1, 12);
      a = divisor * quotient;
      box = divisor;
      result = quotient;
      break;
    }
  }
  return { displayStr: `${a} ${op} □ = ${result}`, answer: box };
}

// パターン3: A + B = □（普通の計算、簡単）
function patternStraight(): Generated {
  const op = (["+", "-", "×"] as Op[])[Math.floor(Math.random() * 3)];
  let a: number, b: number, result: number;
  switch (op) {
    case "+":
      a = rand(10, 99); b = rand(10, 99); result = a + b; break;
    case "-":
      a = rand(30, 99); b = rand(10, a - 1); result = a - b; break;
    case "×":
      a = rand(2, 15); b = rand(2, 15); result = a * b; break;
    default:
      a = 0; b = 0; result = 0;
  }
  return { displayStr: `${a} ${op} ${b} = □`, answer: result };
}

const PATTERNS = [
  patternBoxFirst, patternBoxFirst, patternBoxFirst, // 多めに
  patternBoxSecond, patternBoxSecond,
  patternStraight,
];

export function generateArithmeticQuestion(id: number): ArithmeticQuestion {
  const fn = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const { displayStr, answer } = fn();
  return {
    id,
    type: "arithmetic",
    displayStr,
    answer,
    choices: makeChoices(answer),
  };
}

export function generateArithmeticQuestions(count: number): ArithmeticQuestion[] {
  return Array.from({ length: count }, (_, i) => generateArithmeticQuestion(i + 1));
}
