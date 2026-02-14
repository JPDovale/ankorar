import { Link2 } from "lucide-react";
import { type ReactNode } from "react";

type Shape = "s" | "o" | "c";
type Curve = [number, number];

interface Point {
  x: number;
  y: number;
}

interface NodeShape {
  id: string;
  color: string;
  box: Point;
  curve: Curve;
  outer: Curve;
  inShape: Shape;
  outShape: Shape;
}

interface Swoosh {
  id: string;
  color: string;
  width: number;
  path: string;
}

interface BackgroundNode {
  id: string;
  color: string;
  box: Point;
  curve: Curve;
  size: {
    w: number;
    h: number;
  };
}

interface AuthSceneProps {
  children: ReactNode;
  subtitle?: string;
}

const nodes: NodeShape[] = [
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

const center: Point = { x: 50, y: 50 };

const swooshes: Swoosh[] = [
  {
    id: "swoosh-top",
    color: "#3b82f6",
    width: 2.2,
    path: "M-12 18 C 8 -2, 30 -2, 46 20 S 82 48, 112 16",
  },
  {
    id: "swoosh-mid",
    color: "#a855f7",
    width: 2,
    path: "M-14 52 C 10 70, 32 70, 50 50 S 88 20, 112 40",
  },
  {
    id: "swoosh-bottom",
    color: "#22c55e",
    width: 2.4,
    path: "M-8 86 C 16 104, 38 104, 54 82 S 88 40, 112 66",
  },
  {
    id: "swoosh-top-2",
    color: "#f97316",
    width: 1.8,
    path: "M-10 8 C 12 22, 34 22, 52 10 S 86 -2, 112 8",
  },
  {
    id: "swoosh-mid-2",
    color: "#ec4899",
    width: 1.9,
    path: "M-12 38 C 6 30, 28 30, 46 44 S 88 74, 112 58",
  },
  {
    id: "swoosh-bottom-2",
    color: "#0ea5e9",
    width: 2.1,
    path: "M-8 96 C 20 84, 36 84, 54 98 S 90 124, 112 104",
  },
];

const backgroundNodes: BackgroundNode[] = [
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

function buildPath(shape: Shape, start: Point, end: Point, curve: Curve) {
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

export function AuthScene({
  children,
  subtitle = "Sua mente organiza, ancora e aprende",
}: AuthSceneProps) {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-violet-500/5 to-emerald-500/5 dark:bg-zinc-950">
      <div aria-hidden className="absolute inset-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <filter id="line-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
            {nodes.map((node) => (
              <marker
                key={`arrowhead-${node.id}`}
                id={`arrowhead-${node.id}`}
                markerWidth="2.6"
                markerHeight="2.6"
                refX="2.1"
                refY="1.3"
                orient="auto"
              >
                <path d="M0 0 L2.6 1.3 L0 2.6 Z" fill={node.color} />
              </marker>
            ))}
            {backgroundNodes.map((node) => (
              <marker
                key={`bg-arrow-${node.id}`}
                id={`bg-arrow-${node.id}`}
                markerWidth="2"
                markerHeight="2"
                refX="1.6"
                refY="1"
                orient="auto"
              >
                <path d="M0 0 L2 1 L0 2 Z" fill={node.color} />
              </marker>
            ))}
          </defs>

          {swooshes.map((swoosh) => (
            <path
              key={swoosh.id}
              d={swoosh.path}
              stroke={swoosh.color}
              strokeWidth={swoosh.width * 0.11}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.2"
              filter="url(#line-blur)"
            />
          ))}

          {backgroundNodes.map((node) => (
            <path
              key={`bg-line-${node.id}`}
              d={buildPath("c", center, { x: node.box.x, y: node.box.y }, node.curve)}
              stroke={node.color}
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.2"
              markerEnd={`url(#bg-arrow-${node.id})`}
              filter="url(#line-blur)"
            />
          ))}

          {nodes.map((node) => {
            const nearX = node.box.x;
            const nearY = node.box.y;
            const outerX = node.box.x + node.outer[0];
            const outerY = node.box.y + node.outer[1];
            const outerCurve: Curve = [
              node.outer[0] * 0.35 + node.curve[0] * 0.25,
              node.outer[1] * 0.35 + node.curve[1] * 0.25,
            ];

            return (
              <g key={node.id} opacity="0.3">
                <path
                  d={buildPath(node.inShape, center, { x: nearX, y: nearY }, node.curve)}
                  stroke={node.color}
                  strokeWidth="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  markerEnd={`url(#arrowhead-${node.id})`}
                  filter="url(#line-blur)"
                />
                <path
                  d={buildPath(
                    node.outShape,
                    { x: node.box.x, y: node.box.y },
                    { x: outerX, y: outerY },
                    outerCurve,
                  )}
                  stroke={node.color}
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  markerEnd={`url(#arrowhead-${node.id})`}
                  filter="url(#line-blur)"
                />
              </g>
            );
          })}
        </svg>

        {backgroundNodes.map((node) => (
          <div
            key={`bg-node-${node.id}`}
            className="absolute flex flex-col gap-2 rounded-md border border-white/40 bg-white/70 p-2 shadow-lg blur-[5px] dark:border-zinc-700/40 dark:bg-zinc-800/70"
            style={{
              left: `${node.box.x}%`,
              top: `${node.box.y}%`,
              width: `${node.size.w}px`,
              height: `${node.size.h}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-1.5 w-14 rounded-lg" style={{ backgroundColor: node.color }} />
            <div className="h-1.5 w-full rounded-lg bg-zinc-200/80 dark:bg-zinc-600/80" />
            <div className="h-1.5 w-5/6 rounded-lg bg-zinc-200/80 dark:bg-zinc-600/80" />
          </div>
        ))}

        {nodes.map((node) => (
          <div
            key={`node-${node.id}`}
            className="absolute flex w-64 flex-col gap-2 rounded-lg border border-white/80 bg-white/80 p-3 shadow-lg backdrop-blur blur-[3px] dark:border-zinc-700/40 dark:bg-zinc-800/70"
            style={{
              left: `${node.box.x}%`,
              top: `${node.box.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-2.5 w-16 rounded-lg" style={{ backgroundColor: node.color }} />
            <div className="h-2 w-full rounded-lg bg-zinc-200 dark:bg-zinc-600/80" />
            <div className="h-2 w-5/6 rounded-lg bg-zinc-200 dark:bg-zinc-600/80" />
            <div className="h-2 w-7/8 rounded-lg bg-zinc-200 dark:bg-zinc-600/80" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-xl border-3 border-white bg-zinc-50/30 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl dark:border-zinc-900 dark:bg-zinc-950/50 dark:text-white">
          <div className="flex flex-col items-center">
            <h1 className="flex items-center justify-center gap-1 text-4xl font-extrabold">
              <Link2 className="h-10 w-10" />
              ANKORAR
            </h1>
            <span className="text-xs font-semibold opacity-80">{subtitle}</span>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
