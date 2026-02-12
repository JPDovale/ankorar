import type { MindMapNode } from "../../state/mindMap";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useMindMapState } from "../../state/mindMap";
import { useMindMapNodeMouseHandlers } from "../../hooks/mindMap/useMindMapNodeMouseHandlers";
import { useMindMapNode } from "../../hooks/mindMap/useMindMapNode";
import { useShallow } from "zustand/react/shallow";

type ImageNodeProps = {
  node: MindMapNode;
};

export function ImageNode({ node }: ImageNodeProps) {
  const { node: logicalNode } = useMindMapNode({ nodeId: node.id });

  const { selectedNodeId, editingNodeId, setEditingNode } = useMindMapState(
    useShallow((state) => ({
      selectedNodeId: state.selectedNodeId,
      editingNodeId: state.editingNodeId,
      setEditingNode: state.setEditingNode,
    }))
  );

  const isLeft = logicalNode?.getSide() === "left";
  const hasChildren = node.childrens.length > 0;
  const childrenVisible = node.childrens.some((child) => child.isVisible);
  const hasUrl = node.text.trim().length > 0;
  const isValidUrl = useMemo(() => {
    if (!hasUrl) {
      return false;
    }
    try {
      const parsed = new URL(node.text.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, [hasUrl, node.text]);
  const isEditing = editingNodeId === node.id;
  const showInput = !isValidUrl || isEditing;
  const isLoadingRef = useRef(false);
  const lastSizedUrlRef = useRef<string | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const { onMouseDown, onDoubleClick } = useMindMapNodeMouseHandlers(node.id);
  const isEmpty = node.text.trim().length === 0;

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }
    if (!isEditing && element.textContent !== node.text) {
      element.textContent = node.text;
    }
  }, [isEditing, node.text]);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element || !isEditing) {
      return;
    }
    const focusText = () => {
      element.focus();
      const selection = window.getSelection();
      if (!selection) {
        return;
      }
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };
    requestAnimationFrame(focusText);
  }, [isEditing]);

  useLayoutEffect(() => {
    if (!isEditing || !logicalNode) {
      return;
    }
    const nextW = Math.max(node.style.w, 120);
    const nextH = Math.max(node.style.h, 120);
    if (nextW === node.style.w && nextH === node.style.h) {
      return;
    }
    logicalNode.chain().updateSize(nextW, nextH).commit();
  }, [isEditing, logicalNode, node.style.h, node.style.w]);

  const fitToBounds = (width: number, height: number) => {
    const maxW = 340;
    const maxH = 340;
    const scale = Math.min(maxW / width, maxH / height, 1) * 0.5;
    return {
      w: Math.max(8, Math.round(width * scale)),
      h: Math.max(8, Math.round(height * scale)),
    };
  };

  const handleUrlChange = (value: string) => {
    const trimmed = value.trim();
    logicalNode?.chain().updateText(value).commit();

    if (!trimmed || isLoadingRef.current) {
      return;
    }

    if (lastSizedUrlRef.current === trimmed) {
      return;
    }

    isLoadingRef.current = true;

    const img = new Image();

    img.onload = () => {
      isLoadingRef.current = false;
      lastSizedUrlRef.current = trimmed;

      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }

      const nextSize = fitToBounds(img.naturalWidth, img.naturalHeight);
      logicalNode
        ?.chain()
        .updateText(trimmed)
        .updateSize(nextSize.w, nextSize.h)
        .commit();
    };

    img.onerror = () => {
      isLoadingRef.current = false;
    };
    img.src = trimmed;
  };

  const imageContent = useMemo(() => {
    if (!isValidUrl) {
      return null;
    }
    return (
      <img
        src={node.text.trim()}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    );
  }, [isValidUrl, node.text]);

  return (
    <div
      className="group absolute"
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
          className={`rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm overflow-hidden ${
            node.style.isBold ? "font-semibold" : "font-medium"
          } ${node.style.isItalic ? "italic" : "not-italic"}`}
          style={{
            width: node.style.w,
            height: node.style.h,
            borderColor: node.style.color,
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
          {showInput ? (
            <div className="relative h-full w-full">
              {isEmpty && (
                <span className="pointer-events-none absolute left-3 top-2 text-sm text-slate-400">
                  Cole a URL da imagem
                </span>
              )}
              <span
                ref={textRef}
                className="absolute inset-0 rounded-xl bg-transparent px-3 py-2 text-sm outline-none whitespace-pre"
                contentEditable={isEditing}
                suppressContentEditableWarning
                data-nodex-ui
                onMouseDown={(event) => {
                  event.stopPropagation();
                  if (event.detail > 1) {
                    event.preventDefault();
                  }
                }}
                onFocus={() => {
                  logicalNode?.select();
                  setEditingNode(node.id);
                }}
                onInput={(event) => {
                  handleUrlChange(event.currentTarget.textContent ?? "");
                }}
                onBlur={(event) => {
                  setEditingNode(null);
                  handleUrlChange(event.currentTarget.textContent ?? "");
                }}
              />
            </div>
          ) : (
            imageContent
          )}
        </div>

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 h-[6px] -translate-y-1/2 rounded-md ${
            !isLeft ? "left-0" : "right-0"
          } ${selectedNodeId !== node.id ? "block" : "hidden"}`}
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
                logicalNode?.togglechildrensVisibility();
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
          logicalNode?.addChild();
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
          logicalNode?.destroy();
        }}
        aria-label="Remover node"
      >
        X
      </button>
    </div>
  );
}
