// 基本図形の種類
export type ShapeKind =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "pentagon"
  | "hexagon"
  | "star"
  | "heart";

// 図形（1つの単位）
export interface Shape {
  kind: ShapeKind;
  filled: boolean;     // true = 塗りつぶし、false = 輪郭のみ
  rotation: number;    // 0, 90, 180, 270
  flipH: boolean;      // 左右反転
  flipV: boolean;      // 上下反転
}

// 図形群（命令表で使う：複数図形が並ぶ）
export type ShapeGroup = Shape[];

// 変換ルール（暗号で使う）
export type Transform =
  | { kind: "rotate"; degrees: 90 | 180 | 270 }
  | { kind: "flipH" }
  | { kind: "flipV" }
  | { kind: "invertFill" }       // 塗り <-> 輪郭
  | { kind: "changeShape"; to: ShapeKind };  // 形そのものを変える

// デフォルト形状
export function makeShape(kind: ShapeKind, opts: Partial<Omit<Shape, "kind">> = {}): Shape {
  return {
    kind,
    filled: opts.filled ?? false,
    rotation: opts.rotation ?? 0,
    flipH: opts.flipH ?? false,
    flipV: opts.flipV ?? false,
  };
}

// Shapeのコピー
export function cloneShape(s: Shape): Shape {
  return { ...s };
}

// 図形の等価判定（暗号の正解判定で使う）
export function shapesEqual(a: Shape, b: Shape): boolean {
  return (
    a.kind === b.kind &&
    a.filled === b.filled &&
    ((a.rotation % 360) + 360) % 360 === ((b.rotation % 360) + 360) % 360 &&
    a.flipH === b.flipH &&
    a.flipV === b.flipV
  );
}
