import { Shape, ShapeKind, Transform, makeShape, shapesEqual } from "@/lib/shapes/types";
import { applyTransform } from "@/lib/shapes/transform";

// 推論型暗号問題:
// 1. 上部に「ヒント例」を2〜3個提示 (図形 → [暗号A] → 変換後)
// 2. 問題: 別の図形に同じ暗号を適用した結果を5択から選ぶ
//
// 1問につき1つの暗号 (本物のCABはもっと複雑だが、無限ランダム生成のため簡略化)

export interface CipherExample {
  input: Shape;
  output: Shape;
}

export interface CipherQuestion {
  id: number;
  type: "cipher";
  symbol: string;         // 暗号記号 (例: "★")
  examples: CipherExample[]; // ヒント例
  questionInput: Shape;   // 問題の入力図形
  answer: Shape;          // 正解の出力図形
  choices: Shape[];       // 5択
  transform: Transform;   // 内部的に使った変換 (解説用)
}

const SYMBOLS = ["★", "●", "■", "▲", "◆", "♠", "♥", "♦", "♣", "✦"];
const SHAPES: ShapeKind[] = [
  "circle", "square", "triangle", "diamond",
  "pentagon", "hexagon", "star", "heart",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// ランダムな変換ルールを生成
function randomTransform(): Transform {
  const options: Transform[] = [
    { kind: "rotate", degrees: 90 },
    { kind: "rotate", degrees: 180 },
    { kind: "rotate", degrees: 270 },
    { kind: "flipH" },
    { kind: "flipV" },
    { kind: "invertFill" },
  ];
  return rand(options);
}

// ランダムな図形（暗号で見やすい形のみ：回転で見分けがつくもの優先）
function randomShape(): Shape {
  // 円・正方形は回転しても見えにくいので頻度減らす
  const weighted: ShapeKind[] = [
    "triangle", "triangle", "triangle",  // よく出す
    "diamond", "diamond",
    "pentagon", "pentagon",
    "hexagon",
    "star", "star",
    "heart", "heart",
    "square",
    "circle",
  ];
  return makeShape(rand(weighted), {
    filled: Math.random() < 0.5,
    // 初期回転はゼロにして変化が見えやすく
    rotation: 0,
  });
}

// ランダムだが似てる図形を生成（誤答用）
function generateDistractor(answer: Shape, forbidden: Shape[]): Shape {
  for (let i = 0; i < 50; i++) {
    const candidate: Shape = {
      kind: answer.kind,
      filled: Math.random() < 0.5 ? !answer.filled : answer.filled,
      rotation: rand([0, 90, 180, 270]),
      flipH: Math.random() < 0.5 ? !answer.flipH : answer.flipH,
      flipV: Math.random() < 0.5 ? !answer.flipV : answer.flipV,
    };
    // 違いが必須・既存と被らない
    if (
      !shapesEqual(candidate, answer) &&
      !forbidden.some((f) => shapesEqual(f, candidate))
    ) {
      return candidate;
    }
  }
  // フォールバック：違う形状で
  return makeShape(rand(SHAPES.filter((k) => k !== answer.kind)));
}

export function generateCipherQuestion(id: number): CipherQuestion {
  const transform = randomTransform();
  const symbol = rand(SYMBOLS);
  const exampleCount = randInt(2, 3);

  // ヒント例（重複しない図形で）
  const usedKinds = new Set<ShapeKind>();
  const examples: CipherExample[] = [];
  while (examples.length < exampleCount) {
    const input = randomShape();
    if (usedKinds.has(input.kind)) continue;
    usedKinds.add(input.kind);
    examples.push({
      input,
      output: applyTransform(input, transform),
    });
  }

  // 問題用の入力（ヒントとは違う形状で）
  let questionInput: Shape;
  do {
    questionInput = randomShape();
  } while (usedKinds.has(questionInput.kind));

  const answer = applyTransform(questionInput, transform);

  // 5択生成: 正解 + 4つの誤答
  const choices: Shape[] = [answer];
  while (choices.length < 5) {
    const d = generateDistractor(answer, choices);
    if (!choices.some((c) => shapesEqual(c, d))) {
      choices.push(d);
    }
  }

  return {
    id,
    type: "cipher",
    symbol,
    examples,
    questionInput,
    answer,
    choices: shuffle(choices),
    transform,
  };
}

export function generateCipherQuestions(count: number): CipherQuestion[] {
  return Array.from({ length: count }, (_, i) => generateCipherQuestion(i + 1));
}
