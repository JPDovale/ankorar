import {
  backgroundNodes,
  buildPath,
  center,
  type Curve,
  nodes,
} from "@/components/auth/authSceneData";
import { Link2 } from "lucide-react";
import { type ReactNode } from "react";

interface AuthSceneProps {
  children: ReactNode;
  subtitle?: string;
}

export function AuthScene({
  children,
  subtitle = "Sua mente organiza, ancora e aprende",
}: AuthSceneProps) {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-violet-500/5 to-emerald-500/5 dark:bg-zinc-950">
      <div aria-hidden className="absolute inset-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
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

          {backgroundNodes.map((node) => (
            <path
              key={`bg-line-${node.id}`}
              d={buildPath(
                "c",
                center,
                { x: node.box.x, y: node.box.y },
                node.curve,
              )}
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
                  d={buildPath(
                    node.inShape,
                    center,
                    { x: nearX, y: nearY },
                    node.curve,
                  )}
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
            className="absolute flex flex-col gap-2 rounded-md border border-white/40 bg-white/70 p-2 shadow-sm blur-[5px] dark:border-zinc-700/40 dark:bg-zinc-800/70"
            style={{
              left: `${node.box.x}%`,
              top: `${node.box.y}%`,
              width: `${node.size.w}px`,
              height: `${node.size.h}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="h-1.5 w-14 rounded-lg"
              style={{ backgroundColor: node.color }}
            />
            <div className="h-1.5 w-full rounded-lg bg-zinc-200/80 dark:bg-zinc-600/80" />
            <div className="h-1.5 w-5/6 rounded-lg bg-zinc-200/80 dark:bg-zinc-600/80" />
          </div>
        ))}

        {nodes.map((node) => (
          <div
            key={`node-${node.id}`}
            className="absolute flex w-64 flex-col gap-2 rounded-lg border border-white/80 bg-white/80 p-3 shadow-sm backdrop-blur blur-[3px] dark:border-zinc-700/40 dark:bg-zinc-800/70"
            style={{
              left: `${node.box.x}%`,
              top: `${node.box.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="h-2.5 w-16 rounded-lg"
              style={{ backgroundColor: node.color }}
            />
            <div className="h-2 w-full rounded-lg bg-zinc-200 dark:bg-zinc-600/80" />
            <div className="h-2 w-5/6 rounded-lg bg-zinc-200 dark:bg-zinc-600/80" />
            <div className="h-2 w-7/8 rounded-lg bg-zinc-200 dark:bg-zinc-600/80" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-xl border-3 border-white bg-zinc-50/30 p-6 shadow-xl shadow-black/40 backdrop-blur-xl dark:border-zinc-900 dark:bg-zinc-950/50 dark:text-white">
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
