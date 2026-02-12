import type { CSSProperties } from "react";

import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../lib/utils";

interface BackgroundProps {
  className?: string;
}

export function Background({ className }: BackgroundProps = {}) {
  const { offset, scale } = useMindMapState(
    useShallow((state) => ({
      offset: state.offset,
      scale: state.scale,
    })),
  );
  const gridSize = 40 * scale;

  return (
    <div
      className={cn("absolute inset-0 bg-slate-50", className)}
      style={
        {
          "--nodex-offset-x": `${offset.x}px`,
          "--nodex-offset-y": `${offset.y}px`,
          "--nodex-grid-size": `${gridSize}px`,
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.45) 1px, transparent 1px)",
          backgroundSize:
            "var(--nodex-grid-size, 40px) var(--nodex-grid-size, 40px)",
          backgroundPosition:
            "var(--nodex-offset-x, 0px) var(--nodex-offset-y, 0px)",
        } as CSSProperties
      }
    />
  );
}
