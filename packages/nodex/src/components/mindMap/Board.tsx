import { useRootMouseHandlers } from "../../hooks/mindMap/useRootMouseHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { useUpdateCenter } from "../../hooks/mindMap/useUpdateCenter";
import { useMindMapState } from "../../state/mindMap";
import { type ReactNode, useEffect, useRef } from "react";
import { Nodes } from "./Nodes";
import { NodeStylePopover } from "./NodeStylePopover";
import { KeyboardHelpDialog } from "./KeyboardHelpDialog";
import { cn } from "../../lib/utils";

interface BoardProps {
  children?: ReactNode;
  className?: string;
  /** Optional array of colors applied by branch: each direct child of the central node gets a color, and all its descendants keep the same color. */
  segmentColors?: string[];
}

export function Board({ children, className, segmentColors }: BoardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const applySegmentColors = useMindMapState((s) => s.applySegmentColors);
  const nodes = useMindMapState((s) => s.nodes);

  const { ...mouseHandlers } = useRootMouseHandlers({
    rootRef,
  });

  useUpdateCenter({ rootRef });
  useMindMapHistoryDebounce({ delayMs: 3000 });

  useEffect(() => {
    if (segmentColors?.length) {
      applySegmentColors(segmentColors);
    }
  }, [segmentColors, applySegmentColors, nodes]);

  return (
    <div
      data-nodex-root
      className={cn("relative flex-1 overflow-hidden cursor-grab", className)}
      ref={rootRef}
      {...mouseHandlers}
    >
      {children}
      <KeyboardHelpDialog />
      <NodeStylePopover />
      <Nodes />
    </div>
  );
}
