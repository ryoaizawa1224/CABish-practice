import { Shape, Transform, cloneShape } from "./types";

// 単一の変換を適用
export function applyTransform(shape: Shape, t: Transform): Shape {
  const s = cloneShape(shape);
  switch (t.kind) {
    case "rotate":
      s.rotation = (s.rotation + t.degrees) % 360;
      return s;
    case "flipH":
      s.flipH = !s.flipH;
      return s;
    case "flipV":
      s.flipV = !s.flipV;
      return s;
    case "invertFill":
      s.filled = !s.filled;
      return s;
    case "changeShape":
      s.kind = t.to;
      return s;
  }
}

// 連続変換
export function applyTransforms(shape: Shape, ts: Transform[]): Shape {
  return ts.reduce((acc, t) => applyTransform(acc, t), shape);
}

// 人間が読める変換名
export function transformName(t: Transform): string {
  switch (t.kind) {
    case "rotate": return `${t.degrees}度回転`;
    case "flipH": return "左右反転";
    case "flipV": return "上下反転";
    case "invertFill": return "塗り↔輪郭を反転";
    case "changeShape": return `${t.to}に変える`;
  }
}
