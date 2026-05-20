import { Shape, ShapeKind, makeShape, shapesEqual } from "@/lib/shapes/types";

// 法則性問題: 5つの図形が並んでいて、6番目（一番右）の □ に入る図形を答える
//
// パターン例：
// - 回転: 0°→90°→180°→270°→0°→? (90°)
// - 形の交替: ○ △ ○ △ ○ ? (△)
// - 色の交替: ●○●○●? (○)
// - 連続変換: 各ステップで90度ずつ回転
// - 上下反転の交互適用

export interface SequenceQuestion {
  id: number;
  type: "sequence";
  shapes: Shape[];        // 表示される5つの図形 (6番目が ?)
  answer: Shape;          // 正解
  choices: Shape[];       // 5択
  patternDescription: string; // 解説用
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

const VISIBLE_SHAPES: ShapeKind[] = [
  "triangle", "diamond", "pentagon", "hexagon", "star", "heart", "square",
];

// === パターン生成関数群 ===
// 各関数は [shapes (6個), description] を返す。最後の図形が正解。

function patternRotate(): { shapes: Shape[]; desc: string } {
  const kind = rand(VISIBLE_SHAPES);
  const filled = Math.random() < 0.5;
  const step = rand([45, 90]) as 45 | 90;
  // 6個生成: 0, step, 2step, ...
  const shapes = Array.from({ length: 6 }, (_, i) =>
    makeShape(kind, { filled, rotation: (step * i) % 360 })
  );
  return { shapes, desc: `${step}度ずつ回転` };
}

function patternAlternateShape(): { shapes: Shape[]; desc: string } {
  const [a, b] = shuffle(VISIBLE_SHAPES).slice(0, 2);
  const filled = Math.random() < 0.5;
  const shapes = Array.from({ length: 6 }, (_, i) =>
    makeShape(i % 2 === 0 ? a : b, { filled })
  );
  return { shapes, desc: `${a}と${b}が交互` };
}

function patternAlternateFill(): { shapes: Shape[]; desc: string } {
  const kind = rand(VISIBLE_SHAPES);
  const shapes = Array.from({ length: 6 }, (_, i) =>
    makeShape(kind, { filled: i % 2 === 0 })
  );
  return { shapes, desc: "塗りと輪郭が交互" };
}

function patternFlipAlternate(): { shapes: Shape[]; desc: string } {
  const kind = rand(["triangle", "pentagon", "heart"] as ShapeKind[]);
  const filled = Math.random() < 0.5;
  const shapes = Array.from({ length: 6 }, (_, i) =>
    makeShape(kind, { filled, flipV: i % 2 === 1 })
  );
  return { shapes, desc: "上下反転が交互" };
}

function patternRotateAndFlip(): { shapes: Shape[]; desc: string } {
  const kind = rand(["triangle", "pentagon", "heart", "diamond"] as ShapeKind[]);
  const filled = Math.random() < 0.5;
  const shapes = Array.from({ length: 6 }, (_, i) =>
    makeShape(kind, { filled, rotation: (90 * i) % 360 })
  );
  return { shapes, desc: "90度ずつ回転" };
}

function patternFillToggleAndRotate(): { shapes: Shape[]; desc: string } {
  const kind = rand(["triangle", "pentagon", "star"] as ShapeKind[]);
  const shapes = Array.from({ length: 6 }, (_, i) =>
    makeShape(kind, { filled: i % 2 === 0, rotation: (90 * i) % 360 })
  );
  return { shapes, desc: "塗り反転＋90度回転" };
}

function patternThreeCycle(): { shapes: Shape[]; desc: string } {
  const [a, b, c] = shuffle(VISIBLE_SHAPES).slice(0, 3);
  const filled = Math.random() < 0.5;
  const order = [a, b, c, a, b, c];
  const shapes = order.map((k) => makeShape(k, { filled }));
  return { shapes, desc: `3つの図形が周期的に出現` };
}

const PATTERNS: Array<() => { shapes: Shape[]; desc: string }> = [
  patternRotate,
  patternAlternateShape,
  patternAlternateFill,
  patternFlipAlternate,
  patternRotateAndFlip,
  patternFillToggleAndRotate,
  patternThreeCycle,
];

// 誤答生成: 正解と似ているが違うもの
function generateDistractor(answer: Shape, forbidden: Shape[]): Shape {
  for (let i = 0; i < 50; i++) {
    const candidate: Shape = {
      kind: Math.random() < 0.3
        ? rand(VISIBLE_SHAPES.filter((k) => k !== answer.kind))
        : answer.kind,
      filled: Math.random() < 0.5 ? !answer.filled : answer.filled,
      rotation: rand([0, 90, 180, 270]),
      flipH: false,
      flipV: Math.random() < 0.3 ? !answer.flipV : answer.flipV,
    };
    if (
      !shapesEqual(candidate, answer) &&
      !forbidden.some((f) => shapesEqual(f, candidate))
    ) {
      return candidate;
    }
  }
  return makeShape(rand(VISIBLE_SHAPES));
}

export function generateSequenceQuestion(id: number): SequenceQuestion {
  const fn = rand(PATTERNS);
  const { shapes: full, desc } = fn();
  const visible = full.slice(0, 5);
  const answer = full[5];

  const choices: Shape[] = [answer];
  while (choices.length < 5) {
    const d = generateDistractor(answer, choices);
    if (!choices.some((c) => shapesEqual(c, d))) {
      choices.push(d);
    }
  }

  return {
    id,
    type: "sequence",
    shapes: visible,
    answer,
    choices: shuffle(choices),
    patternDescription: desc,
  };
}

export function generateSequenceQuestions(count: number): SequenceQuestion[] {
  return Array.from({ length: count }, (_, i) => generateSequenceQuestion(i + 1));
}
