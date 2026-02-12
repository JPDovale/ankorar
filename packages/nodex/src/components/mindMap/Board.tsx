import { useRootMouseHandlers } from "../../hooks/mindMap/useRootMouseHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { useUpdateCenter } from "../../hooks/mindMap/useUpdateCenter";
import { type ReactNode, useRef } from "react";
import { Nodes } from "./Nodes";
import { NodeStylePopover } from "./NodeStylePopover";
import { KeyboardHelpDialog } from "./KeyboardHelpDialog";

interface BoardProps {
  children?: ReactNode;
}

export function Board({ children }: BoardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { ...mouseHandlers } = useRootMouseHandlers({
    rootRef,
  });

  useUpdateCenter({ rootRef });
  useMindMapHistoryDebounce({ delayMs: 3000 });

  return (
    <div
      data-nodex-root
      className="relative flex-1 overflow-hidden cursor-grab"
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
