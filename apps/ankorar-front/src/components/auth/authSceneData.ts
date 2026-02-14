export type Shape = "s" | "o" | "c";
export type Curve = [number, number];

export interface Point {
  x: number;
  y: number;
}

export interface NodeShape {
  id: string;
  color: string;
  box: Point;
  curve: Curve;
  outer: Curve;
  inShape: Shape;
  outShape: Shape;
}

export interface Swoosh {
  id: string;
  color: string;
  width: number;
  path: string;
}

export interface BackgroundNode {
  id: string;
  color: string;
  box: Point;
  curve: Curve;
  size: {
    w: number;
    h: number;
  };
}

export const nodes: NodeShape[] = [
  {
    id: "left-top",
    color: "#2563eb",
    box: { x: 18, y: 28 },
    curve: [2, -32],
    outer: [-20, -26],
    inShape: "s",
    outShape: "c",
  },
  {
    id: "left-mid",
    color: "#06b6d4",
    box: { x: 14, y: 48 },
    curve: [-2, 8],
    outer: [-26, 16],
    inShape: "c",
    outShape: "o",
  },
  {
    id: "left-low",
    color: "#22c55e",
    box: { x: 18, y: 78 },
    curve: [-12, 20],
    outer: [-20, 26],
    inShape: "s",
    outShape: "c",
  },
  {
    id: "right-top",
    color: "#a855f7",
    box: { x: 84, y: 26 },
    curve: [4, -18],
    outer: [22, -26],
    inShape: "s",
    outShape: "c",
  },
  {
    id: "right-mid",
    color: "#ec4899",
    box: { x: 86, y: 52 },
    curve: [8, -10],
    outer: [26, 6],
    inShape: "c",
    outShape: "o",
  },
  {
    id: "right-low",
    color: "#f97316",
    box: { x: 78, y: 86 },
    curve: [6, 18],
    outer: [20, 22],
    inShape: "s",
    outShape: "c",
  },
];

export const center: Point = { x: 50, y: 50 };

export const backgroundNodes: BackgroundNode[] = [
  {
    id: "bg-left-top",
    color: "#93c5fd",
    box: { x: 10, y: 18 },
    curve: [-14, -8],
    size: { w: 120, h: 54 },
  },
  {
    id: "bg-left-bottom",
    color: "#67e8f9",
    box: { x: 12, y: 70 },
    curve: [-16, 10],
    size: { w: 130, h: 54 },
  },
  {
    id: "bg-top",
    color: "#fcd34d",
    box: { x: 50, y: 10 },
    curve: [0, -16],
    size: { w: 140, h: 54 },
  },
  {
    id: "bg-right-top",
    color: "#d8b4fe",
    box: { x: 45, y: 92 },
    curve: [6, -10],
    size: { w: 100, h: 52 },
  },
  {
    id: "bg-right-bottom",
    color: "#f9a8d4",
    box: { x: 90, y: 74 },
    curve: [16, 12],
    size: { w: 132, h: 54 },
  },
];

export function buildPath(
  shape: Shape,
  start: Point,
  end: Point,
  curve: Curve,
) {
  const [curveX, curveY] = curve;

  if (shape === "s") {
    const midX = (start.x + end.x) / 2 + curveX;
    const midY = (start.y + end.y) / 2 + curveY;
    const c1x = start.x + curveX;
    const c1y = start.y + curveY;
    const c2x = midX - curveX;
    const c2y = midY - curveY;
    const c3x = midX + curveX;
    const c3y = midY + curveY;
    const c4x = end.x - curveX;
    const c4y = end.y - curveY;

    return `M${start.x} ${start.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${midX} ${midY} C ${c3x} ${c3y}, ${c4x} ${c4y}, ${end.x} ${end.y}`;
  }

  if (shape === "o") {
    const loopX = curveX * 0.9;
    const loopY = curveY * 0.9;
    const loopEndX = start.x + loopX * 0.2;
    const loopEndY = start.y + loopY * 1.6;
    const midX = (loopEndX + end.x) / 2 + curveX * 0.5;
    const midY = (loopEndY + end.y) / 2 + curveY * 0.5;

    return `M${start.x} ${start.y} C ${start.x + loopX} ${start.y + loopY}, ${start.x - loopX} ${start.y + loopY}, ${loopEndX} ${loopEndY} C ${midX} ${midY}, ${end.x - curveX * 0.4} ${end.y - curveY * 0.4}, ${end.x} ${end.y}`;
  }

  const c1x = start.x + curveX;
  const c1y = start.y + curveY;
  const c2x = end.x + curveX * 0.65;
  const c2y = end.y + curveY * 0.65;

  return `M${start.x} ${start.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${end.x} ${end.y}`;
}
