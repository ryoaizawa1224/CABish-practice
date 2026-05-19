import { CommandQuestion, CommandRule } from "@/types";

const SYMBOLS = ["▲", "■", "●", "◆", "★", "▼", "◀", "▶", "♦", "✦"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyRule(
  value: number,
  op: CommandRule["operation"],
  v: number
): number {
  switch (op) {
    case "add": return value + v;
    case "sub": return value - v;
    case "mul": return value * v;
    case "div": return Math.floor(value / v);
  }
}

export function generateCommandQuestion(id: number): CommandQuestion {
  const ruleCount = rand(3, 5);
  const symbols = SYMBOLS.slice().sort(() => Math.random() - 0.5).slice(0, ruleCount);
  const ops: CommandRule["operation"][] = ["add", "sub", "mul", "div"];

  const rules: CommandRule[] = symbols.map((symbol) => ({
    symbol,
    operation: ops[Math.floor(Math.random() * ops.length)],
    value: rand(1, 9),
  }));

  // 割り算は value=1以上になるように（0除算回避）
  rules.forEach((r) => {
    if (r.operation === "div") r.value = rand(2, 5);
  });

  const initialValue = rand(10, 50);
  const stepCount = rand(4, 7);
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
  };
}

export function generateCommandQuestions(count: number): CommandQuestion[] {
  return Array.from({ length: count }, (_, i) => generateCommandQuestion(i + 1));
}
