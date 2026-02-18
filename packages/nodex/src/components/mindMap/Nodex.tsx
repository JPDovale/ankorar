import { type ReactNode, useEffect } from "react";
import { useRootKeyBindHandlers } from "../../hooks/mindMap/useRootKeyBindHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { cn } from "../../lib/utils";
import { useMindMapState } from "../../state/mindMap";
import {
  MindMapNodeEditorProvider,
  type NodeEditorCustomButton,
} from "../../contexts/MindMapNodeEditorContext";

interface NodexProps {
  children?: ReactNode;
  className?: string;
  readOnly?: boolean;
  /** Custom buttons for the floating node editor toolbar. Each button receives the selected node in its callback. */
  nodeEditorCustomButtons?: NodeEditorCustomButton[];
}

export function Nodex({
  children,
  className,
  readOnly = false,
  nodeEditorCustomButtons,
}: NodexProps) {
  const setReadOnly = useMindMapState((state) => state.setReadOnly);

  useRootKeyBindHandlers();
  useMindMapHistoryDebounce();

  useEffect(() => {
    setReadOnly(readOnly);

    return () => {
      setReadOnly(false);
    };
  }, [readOnly, setReadOnly]);

  return (
    <MindMapNodeEditorProvider customButtons={nodeEditorCustomButtons ?? []}>
      <section
        data-nodex
        className={cn(
          "flex h-full min-h-[480px] w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm font-sans",
          className,
        )}
      >
        {children}
      </section>
    </MindMapNodeEditorProvider>
  );
}
