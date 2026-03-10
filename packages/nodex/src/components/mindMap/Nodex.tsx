import { type ReactNode, useEffect } from "react";
import { useRootKeyBindHandlers } from "../../hooks/mindMap/useRootKeyBindHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { cn } from "../../lib/utils";
import { useMindMapState } from "../../state/mindMap";
import {
  MindMapNodeEditorProvider,
  type NodeEditorCustomButton,
} from "../../contexts/MindMapNodeEditorContext";
import {
  CustomNodeRenderersProvider,
  type CustomNodeRenderers,
} from "../../contexts/CustomNodeRenderersContext";

interface NodexProps {
  children?: ReactNode;
  className?: string;
  readOnly?: boolean;
  /** Custom buttons for the floating node editor toolbar. Each button receives the selected node in its callback. */
  nodeEditorCustomButtons?: NodeEditorCustomButton[];
  /** Default text color for newly created nodes (Tab/Enter). E.g. "white" or "#ffffff" for dark backgrounds. */
  newNodesTextColor?: string | null;
  /** Custom node renderers: map of customType string to component. Enables type "custom" nodes with customType key. */
  customNodeRenderers?: CustomNodeRenderers;
}

export function Nodex({
  children,
  className,
  readOnly = false,
  nodeEditorCustomButtons,
  newNodesTextColor,
  customNodeRenderers,
}: NodexProps) {
  const setReadOnly = useMindMapState((state) => state.setReadOnly);
  const setNewNodesTextColor = useMindMapState(
    (state) => state.setNewNodesTextColor,
  );

  useRootKeyBindHandlers();
  useMindMapHistoryDebounce();

  useEffect(() => {
    setReadOnly(readOnly);

    return () => {
      setReadOnly(false);
    };
  }, [readOnly, setReadOnly]);

  useEffect(() => {
    setNewNodesTextColor(newNodesTextColor ?? null);

    return () => {
      setNewNodesTextColor(null);
    };
  }, [newNodesTextColor, setNewNodesTextColor]);

  return (
    <MindMapNodeEditorProvider customButtons={nodeEditorCustomButtons ?? []}>
      <CustomNodeRenderersProvider
        customNodeRenderers={customNodeRenderers ?? {}}
      >
        <section
          data-nodex
          className={cn(
            "flex h-full min-h-[480px] w-full flex-col rounded-2xl bg-slate-50 text-slate-900 shadow-sm font-sans",
            className,
          )}
        >
          {children}
        </section>
      </CustomNodeRenderersProvider>
    </MindMapNodeEditorProvider>
  );
}
