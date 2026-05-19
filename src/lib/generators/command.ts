import { CommandQuestion, CommandRule } from "@/types";

const SYMBOLS = ["▲", "■", "●", "◆", "★", "▼", "◀", "▶"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function makeChoices(answer: number): number[] {
  const set = new Set<number>([answer]);
  const offsets = [-5, -3, -1, 1, 3, 5, -7, 7, 2, -2];
  for (const o of shuffle(offsets)) {
    set.add(answer + o);
    if (set.size >= 5) break;
  }
  let extra = 10;
  while (set.size < 5) { set.add(answer + extra); extra += 5; }
  return shuffle([...set]);
}

function applyRule(value: number, op: CommandRule["operation"], v: number): number {
  switch (op) {
    case "add": return value + v;
    case "sub": return value - v;
    case "mul": return value * v;
    case "div": return Math.floor(value / v);
  }
}

export function generateCommandQuestion(id: number): CommandQuestion {
  const ruleCount = rand(3, 4);
  const syms = shuffle(SYMBOLS).slice(0, ruleCount);
  const ops: CommandRule["operation"][] = ["add", "sub", "mul", "div"];

  const rules: CommandRule[] = syms.map((symbol) => ({
    symbol,
    operation: ops[Math.floor(Math.random() * ops.length)],
    value: rand(1, 9),
  }));
  // 除算は2以上
  rules.forEach((r) => { if (r.operation === "div") r.value = rand(2, 4); });

  const initialValue = rand(10, 30);
  const stepCount = rand(4, 6);
  const steps: string[] = Array.from(
    { length: stepCount },
    () => rules[Math.floor(Math.random() * rules.length)].symbol
  );

  let current = initialValue;
  for (const sym of steps) {
    const rule = rules.find((r) => r.symbol === sym)!;
    current = applyRule(current, rule.operation, rule.value);
  }

  return {
    id,
    type: "command",
    rules,
    initialValue,
    steps,
    answer: current,
    choices: makeChoices(current),
  };
}

export function generateCommandQuestions(count: number): CommandQuestion[] {
  return Array.from({ length: count }, (_, i) => generateCommandQuestion(i + 1));
}
