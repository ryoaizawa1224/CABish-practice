import { Shape, ShapeKind, makeShape, shapesEqual } from "@/lib/shapes/types";

// 命令表問題: 初期図形列に対して命令を順次適用、最終形を選ぶ
//
// 命令の種類:
// - flipLR: すべての図形を左右反転
// - flipUD: すべての図形を上下反転
// - invertFill: すべての図形の塗りを反転
// - deleteFirst: 先頭の図形を削除
// - deleteLast: 末尾の図形を削除
// - rotate90: 全図形を90度回転
// - rotate180: 全図形を180度回転
// - swap: 先頭と末尾を入れ替え
// - cancelPrev: 直前の命令を取り消す（実行順より前の段階で除外）

export type CommandKind =
  | "flipLR"
  | "flipUD"
  | "invertFill"
  | "deleteFirst"
  | "deleteLast"
  | "rotate90"
  | "rotate180"
  | "swap"
  | "cancelPrev";

export interface Command {
  symbol: string;       // 命令の見出し記号 (例: "▲")
  kind: CommandKind;
}

export interface CommandQuestion {
  id: number;
  type: "command";
  initial: Shape[];       // 初期図形列
  commands: Command[];    // 適用する命令列
  answer: Shape[];        // 最終形
  choices: Shape[][];     // 5択（各択は図形列）
}

const SYMBOLS = ["▲", "■", "●", "◆", "★", "▼", "◀", "▶", "♦", "✦", "✿"];
const VISIBLE_SHAPES: ShapeKind[] = [
  "triangle", "diamond", "pentagon", "heart", "star", "hexagon",
];

const COMMAND_LABELS: Record<CommandKind, string> = {
  flipLR: "全て左右反転",
  flipUD: "全て上下反転",
  invertFill: "塗りと輪郭を反転",
  deleteFirst: "先頭を消す",
  deleteLast: "末尾を消す",
  rotate90: "全て90度回転",
  rotate180: "全て180度回転",
  swap: "先頭と末尾を入替",
  cancelPrev: "直前の命令を取消",
};

export function commandLabel(k: CommandKind): string {
  return COMMAND_LABELS[k];
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// 命令を順次実行（cancelPrev は直前を無効化）
export function executeCommands(initial: Shape[], commands: Command[]): Shape[] {
  // cancelPrev を解決: 残る命令だけ抽出
  const effective: Command[] = [];
  for (const c of commands) {
    if (c.kind === "cancelPrev") {
      effective.pop();
    } else {
      effective.push(c);
    }
  }

  let shapes: Shape[] = initial.map((s) => ({ ...s }));
  for (const c of effective) {
    switch (c.kind) {
      case "flipLR":
        shapes = shapes.map((s) => ({ ...s, flipH: !s.flipH }));
        break;
      case "flipUD":
        shapes = shapes.map((s) => ({ ...s, flipV: !s.flipV }));
        break;
      case "invertFill":
        shapes = shapes.map((s) => ({ ...s, filled: !s.filled }));
        break;
      case "deleteFirst":
        shapes = shapes.slice(1);
        break;
      case "deleteLast":
        shapes = shapes.slice(0, -1);
        break;
      case "rotate90":
        shapes = shapes.map((s) => ({ ...s, rotation: (s.rotation + 90) % 360 }));
        break;
      case "rotate180":
        shapes = shapes.map((s) => ({ ...s, rotation: (s.rotation + 180) % 360 }));
        break;
      case "swap":
        if (shapes.length >= 2) {
          const last = shapes.length - 1;
          [shapes[0], shapes[last]] = [shapes[last], shapes[0]];
        }
        break;
    }
  }
  return shapes;
}

function shapeListsEqual(a: Shape[], b: Shape[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((s, i) => shapesEqual(s, b[i]));
}

// 誤答を1つの命令だけ変えて生成
function generateDistractor(
  initial: Shape[],
  commands: Command[],
  answer: Shape[],
  forbidden: Shape[][]
): Shape[] | null {
  const allKinds: CommandKind[] = [
    "flipLR", "flipUD", "invertFill",
    "deleteFirst", "deleteLast",
    "rotate90", "rotate180", "swap",
  ];
  for (let attempt = 0; attempt < 30; attempt++) {
    // ランダムに1つの命令を別の命令に置き換え
    const altered = commands.map((c) => ({ ...c }));
    const idx = randInt(0, altered.length - 1);
    if (altered[idx].kind === "cancelPrev") continue;
    const newKind = rand(allKinds.filter((k) => k !== altered[idx].kind));
    altered[idx] = { ...altered[idx], kind: newKind };
    const result = executeCommands(initial, altered);
    // 空でない・正解と違う・既存と被らない
    if (
      result.length > 0 &&
      !shapeListsEqual(result, answer) &&
      !forbidden.some((f) => shapeListsEqual(f, result))
    ) {
      return result;
    }
  }
  return null;
}

export function generateCommandQuestion(id: number): CommandQuestion {
  // 初期図形 2〜3個
  const count = randInt(2, 3);
  const initial: Shape[] = Array.from({ length: count }, () =>
    makeShape(rand(VISIBLE_SHAPES), { filled: Math.random() < 0.5 })
  );

  // 命令 2〜4個 (cancelPrev は最大1個)
  const commandCount = randInt(2, 4);
  const baseKinds: CommandKind[] = [
    "flipLR", "flipUD", "invertFill", "rotate90", "rotate180", "swap",
  ];
  // 削除系は1問あたり最大1つ（全部消えるのを防ぐ）
  const deleteKinds: CommandKind[] = ["deleteFirst", "deleteLast"];

  const commands: Command[] = [];
  let deleteUsed = false;
  let cancelUsed = false;
  while (commands.length < commandCount) {
    const allowCancel = !cancelUsed && commands.length > 0 && Math.random() < 0.25;
    const allowDelete = !deleteUsed && initial.length >= 2 && Math.random() < 0.3;
    let kind: CommandKind;
    if (allowCancel) {
      kind = "cancelPrev";
      cancelUsed = true;
    } else if (allowDelete) {
      kind = rand(deleteKinds);
      deleteUsed = true;
    } else {
      kind = rand(baseKinds);
    }
    commands.push({ symbol: rand(SYMBOLS), kind });
  }

  const answer = executeCommands(initial, commands);

  // 万一空になったら再生成
  if (answer.length === 0) {
    return generateCommandQuestion(id);
  }

  const choices: Shape[][] = [answer];
  let tries = 0;
  while (choices.length < 5 && tries < 100) {
    tries++;
    const d = generateDistractor(initial, commands, answer, choices);
    if (d) choices.push(d);
  }
  // それでも揃わない場合のフォールバック
  while (choices.length < 5) {
    // ランダムな図形列を追加
    const fake = answer.map((s) => ({
      ...s,
      filled: !s.filled,
      rotation: rand([0, 90, 180, 270]),
    }));
    if (!choices.some((c) => shapeListsEqual(c, fake))) {
      choices.push(fake);
    } else {
      break;
    }
  }

  return {
    id,
    type: "command",
    initial,
    commands,
    answer,
    choices: shuffle(choices),
  };
}

export function generateCommandQuestions(count: number): CommandQuestion[] {
  return Array.from({ length: count }, (_, i) => generateCommandQuestion(i + 1));
}
