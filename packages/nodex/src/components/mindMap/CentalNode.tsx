import type { MindMapNode } from "../../state/mindMap";
import { useRef } from "react";
import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { useMindMapNodeMouseHandlers } from "../../hooks/mindMap/useMindMapNodeMouseHandlers";
import { useMindMapNode } from "../../hooks/mindMap/useMindMapNode";
import { useMindMapNodeEditor } from "../../hooks/mindMap/useMindMapNodeEditor";
import { cn } from "../../lib/utils";

type CentalNodeProps = {
  node: MindMapNode;
  className?: string;
};

export function CentalNode({ node, className }: CentalNodeProps) {
  const { editingNodeId, selectedNodeId, readOnly } = useMindMapState(
    useShallow((state) => ({
      selectedNodeId: state.selectedNodeId,
      editingNodeId: state.editingNodeId,
      readOnly: state.readOnly,
    })),
  );

  const textRef = useRef<HTMLSpanElement | null>(null);
  const { node: logicalNode } = useMindMapNode({ nodeId: node.id });
  const { onMouseDown, onDoubleClick } = useMindMapNodeMouseHandlers(node.id);
  const editableHandlers = useMindMapNodeEditor({
    nodeId: node.id,
    text: node.text,
    textRef,
  });

  return (
    <div
      className={cn("group absolute", className)}
      data-nodex-node
      style={{
        transform: `translate(${node.pos.x}px, ${node.pos.y}px)`,
        width: node.style.w + node.style.wrapperPadding * 2,
        height: node.style.h + node.style.wrapperPadding * 2,
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div
        className="relative h-full w-full"
        style={{ padding: node.style.wrapperPadding }}
      >
        <div
          data-bold={node.style.isBold}
          data-italic={node.style.isItalic}
          className={cn(
            "flex items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 shadow-sm data-[bold=true]:font-bold data-[italic=true]:italic",
            editingNodeId === node.id ? "select-text" : "select-none",
          )}
          style={{
            width: node.style.w,
            height: node.style.h,
            padding: `${node.style.padding.y}px ${node.style.padding.x}px`,
            borderColor: node.style.color,
            fontSize: node.style.fontSize,
            color: node.style.textColor,
            backgroundColor: node.style.backgroundColor,
            textAlign: node.style.textAlign,
            boxShadow:
              selectedNodeId === node.id
                ? `0 0 0 3px ${node.style.color}`
                : undefined,
          }}
          onDoubleClick={onDoubleClick}
        >
          <span
            ref={textRef}
            className="whitespace-pre outline-none leading-none"
            contentEditable={!readOnly && editingNodeId === node.id}
            suppressContentEditableWarning
            onMouseDown={(event) => {
              if (event.detail > 1) {
                event.preventDefault();
              }
            }}
            {...editableHandlers}
          />
        </div>
      </div>

      <button
        type="button"
        data-selected={selectedNodeId === node.id}
        data-editing={editingNodeId === node.id}
        data-read-only={readOnly}
        className="absolute data-[read-only=false]:data-[selected=true]:data-[editing=false]:flex hidden -right-3 top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-700 shadow-sm transition"
        style={{ borderColor: node.style.color, color: node.style.color }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          logicalNode?.addChild();
        }}
        aria-label="Adicionar node"
      >
        +
      </button>
    </div>
  );
}
