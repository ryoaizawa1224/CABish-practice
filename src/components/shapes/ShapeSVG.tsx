import { Shape, ShapeKind } from "@/lib/shapes/types";

interface ShapeSVGProps {
  shape: Shape;
  size?: number;
  color?: string;
}

// 各図形のSVGパス（viewBox 0 0 100 100、中心が50,50）
const SHAPE_PATHS: Record<ShapeKind, React.ReactElement> = {
  circle: <circle cx={50} cy={50} r={36} />,
  square: <rect x={16} y={16} width={68} height={68} rx={2} />,
  triangle: <polygon points="50,12 88,82 12,82" />,
  diamond: <polygon points="50,10 88,50 50,90 12,50" />,
  pentagon: <polygon points="50,10 90,40 75,85 25,85 10,40" />,
  hexagon: <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />,
  star: (
    <polygon points="50,8 61,38 92,38 67,57 76,88 50,70 24,88 33,57 8,38 39,38" />
  ),
  heart: (
    <path d="M50,84 C20,60 8,40 25,25 C35,17 45,22 50,32 C55,22 65,17 75,25 C92,40 80,60 50,84 Z" />
  ),
};

export function ShapeSVG({ shape, size = 56, color = "#111827" }: ShapeSVGProps) {
  const path = SHAPE_PATHS[shape.kind];

  // 変換のCSS文字列を組み立てる
  const transforms: string[] = [];
  if (shape.rotation !== 0) transforms.push(`rotate(${shape.rotation} 50 50)`);
  if (shape.flipH) transforms.push(`scale(-1, 1) translate(-100, 0)`);
  if (shape.flipV) transforms.push(`scale(1, -1) translate(0, -100)`);
  const transform = transforms.length > 0 ? transforms.join(" ") : undefined;

  const fillProps = shape.filled
    ? { fill: color, stroke: color, strokeWidth: 2 }
    : { fill: "transparent", stroke: color, strokeWidth: 3.5 };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
      aria-hidden
    >
      <g transform={transform} {...fillProps} strokeLinejoin="round">
        {path}
      </g>
    </svg>
  );
}

// 図形群（横並び）
export function ShapeGroupSVG({
  shapes,
  size = 44,
  color = "#111827",
  gap = 6,
}: {
  shapes: Shape[];
  size?: number;
  color?: string;
  gap?: number;
}) {
  if (shapes.length === 0) {
    return <div className="text-gray-300 text-sm">（なし）</div>;
  }
  return (
    <div className="flex items-center" style={{ gap }}>
      {shapes.map((s, i) => (
        <ShapeSVG key={i} shape={s} size={size} color={color} />
      ))}
    </div>
  );
}
