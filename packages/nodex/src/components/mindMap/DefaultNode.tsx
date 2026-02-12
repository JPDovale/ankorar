import type { MindMapNode } from "../../state/mindMap";
import { useRef } from "react";
import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { useMindMapNodeMouseHandlers } from "../../hooks/mindMap/useMindMapNodeMouseHandlers";
import { useMindMapNode } from "../../hooks/mindMap/useMindMapNode";
import { useMindMapNodeEditor } from "../../hooks/mindMap/useMindMapNodeEditor";
import { cn } from "../../lib/utils";

type DefaultNodeProps = {
  node: MindMapNode;
  className?: string;
};

export function DefaultNode({ node, className }: DefaultNodeProps) {
  const { node: logicalNode } = useMindMapNode({ nodeId: node.id });

  if (!logicalNode) return;

  const { editingNodeId, selectedNodeId } = useMindMapState(
    useShallow((state) => ({
      selectedNodeId: state.selectedNodeId,
      editingNodeId: state.editingNodeId,
    })),
  );

  const side = logicalNode.getSide();
  const isLeft = side === "left";

  const hasChildren = node.childrens.length > 0;
  const childrenVisible = node.childrens.some((child) => child.isVisible);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const editableHandlers = useMindMapNodeEditor({
    nodeId: node.id,
    text: node.text,
    textRef,
  });

  const { onMouseDown, onDoubleClick } = useMindMapNodeMouseHandlers(node.id);

  return (
    <div
      className={cn("group absolute", className)}
      data-nodex-node
      style={{
        transform: `translate(${node.pos.x}px, ${node.pos.y}px)`,
        width: node.style.w + node.style.wrapperPadding * 2,
        height: node.style.h + node.style.wrapperPadding * 2,
      }}
    >
      <div
        className="relative h-full w-full"
        style={{ padding: node.style.wrapperPadding }}
      >
        <div
          className="rounded-xl px-3 py-2 text-slate-900 data-[bold=true]:font-semibold data-[italic=true]:italic"
          data-bold={node.style.isBold}
          data-italic={node.style.isItalic}
          style={{
            width: node.style.w,
            height: node.style.h,
            borderColor: node.style.color,
            fontSize: node.style.fontSize,
            color: node.style.textColor,
            backgroundColor: node.style.backgroundColor,
            textAlign: node.style.textAlign,
            boxShadow:
              selectedNodeId === node.id
                ? `0 0 0 2px ${node.style.color}`
                : undefined,
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          <span
            ref={textRef}
            className="inline-block whitespace-pre outline-none"
            contentEditable={editingNodeId === node.id}
            suppressContentEditableWarning
            onMouseDown={(event) => {
              if (event.detail > 1) {
                event.preventDefault();
              }
            }}
            {...editableHandlers}
          />
        </div>

        <span
          aria-hidden="true"
          data-left={isLeft}
          data-selected={selectedNodeId === node.id}
          className="pointer-events-none absolute top-1/2 h-[6px] -translate-y-1/2 rounded-md data-[left=false]:left-0 right-0  data-[selected=true]:hidden block"
          style={{
            width: node.style.wrapperPadding,
            backgroundColor: node.style.color,
          }}
        />

        {hasChildren && (
          <>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 h-[6px] rounded-md -translate-y-1/2 ${
                isLeft ? "left-0" : "right-0"
              }`}
              style={{
                width: node.style.wrapperPadding / 2,
                marginRight: isLeft ? 0 : 12,
                marginLeft: isLeft ? 12 : 0,
                backgroundColor: node.style.color,
              }}
            />

            <span
              aria-hidden="true"
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full text-xs flex items-center font-bold justify-center border-2 ${
                isLeft ? "-left-1.5" : "-right-1.5"
              }`}
              style={{
                color: node.style.color,
                borderColor: node.style.color,
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                logicalNode.togglechildrensVisibility();
              }}
            >
              {!childrenVisible && node.childrens.length}
              {childrenVisible && (
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: node.style.color,
                  }}
                />
              )}
            </span>
          </>
        )}
      </div>

      <button
        type="button"
        className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-700 shadow-sm transition ${
          selectedNodeId === node.id && editingNodeId !== node.id
            ? "flex"
            : "hidden"
        } ${isLeft ? "-left-2.5" : "-right-2.5"}`}
        style={{ borderColor: node.style.color, color: node.style.color }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          logicalNode.addChild();
        }}
        aria-label="Adicionar node"
      >
        +
      </button>

      <button
        type="button"
        className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 shadow-sm transition ${
          selectedNodeId === node.id ? "flex" : "hidden"
        } ${isLeft ? "-right-3" : "-left-3"}`}
        style={{ borderColor: node.style.color, color: node.style.color }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          logicalNode.destroy();
        }}
        aria-label="Remover node"
      >
        X
      </button>
    </div>
  );
}
