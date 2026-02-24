import type { CSSProperties } from "react";

import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../lib/utils";

export interface BackgroundProps {
  /** Classes CSS adicionais; quando passado, o fundo padrão (bg-slate-50) não é aplicado, permitindo estilização coerente com a aplicação */
  className?: string;
  /** Estilos inline; mesclado após os estilos internos (grid, offset), permitindo sobrescrever cor de fundo, grid etc. */
  style?: CSSProperties;
}

const GRID_SIZE = 40;

export function Background({ className, style }: BackgroundProps = {}) {
  const { offset, scale } = useMindMapState(
    useShallow((state) => ({
      offset: state.offset,
      scale: state.scale,
    })),
  );
  const gridSizePx = GRID_SIZE * scale;

  return (
    <div
      className={cn("absolute inset-0", className ?? "bg-slate-50")}
      style={
        {
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.45) 1px, transparent 1px)",
          backgroundSize: `${gridSizePx}px ${gridSizePx}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
          ...style,
        } as CSSProperties
      }
    />
  );
}
