import type { CustomNodeProps } from "@ankorar/nodex";
import {
  useMindMapNode,
  useMindMapNodeMouseHandlers,
  useMindMapState,
} from "@ankorar/nodex";
import { useShallow } from "zustand/react/shallow";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/useNotes";
import { useNote } from "@/hooks/useNote";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor";
import { ChevronDown, ChevronRight, FileText, LoaderCircle } from "lucide-react";

type NotePayload = { noteId?: string; contentCollapsed?: boolean };

function getNoteId(payload: unknown): string | undefined {
  return (payload as NotePayload)?.noteId;
}

function isContentCollapsed(payload: unknown): boolean {
  return Boolean((payload as NotePayload)?.contentCollapsed);
}

export function NoteNode({
  node,
  className,
  style,
  contentClassName,
  contentStyle,
}: CustomNodeProps) {
  const { node: logicalNode } = useMindMapNode({ nodeId: node.id });
  const { selectedNodeId, readOnly, findNode, updateNode } = useMindMapState(
    useShallow((s) => ({
      selectedNodeId: s.selectedNodeId,
      readOnly: s.readOnly,
      findNode: s.findNode,
      updateNode: s.updateNode,
    })),
  );
  const { onMouseDown, onDoubleClick } = useMindMapNodeMouseHandlers(node.id);
  const { notes, isLoadingNotes } = useNotes();
  const noteId = getNoteId(node.customPayload);
  const { note, isLoadingNote } = useNote({ id: noteId });
  const [pickerOpen, setPickerOpen] = useState(false);
  const contentCollapsed = isContentCollapsed(node.customPayload);

  const isLeft =
    logicalNode && typeof logicalNode.getSide === "function"
      ? logicalNode.getSide() === "left"
      : false;
  const hasChildren = node.childrens.length > 0;
  const childrenVisible = node.childrens.some((child) => child.isVisible);

  /** Tamanho do card de conteúdo da nota. Nodex preserva w/h em nós custom (não reaplica measure). */
  const NOTE_CARD_W = 360;
  const NOTE_CARD_H = 420;

  /** Ao selecionar uma nota: salva como CUSTOM (type + customType + customPayload só id) e tamanho grande. O nodex não reaplica measure em nós custom, então w/h são preservados. */
  const handleSelectNote = useCallback(
    (selectedId: string) => {
      if (readOnly) return;
      const current = findNode(node.id);
      if (!current) return;
      updateNode({
        ...current,
        type: "custom",
        customType: "note",
        text: "Nota",
        customPayload: { noteId: selectedId },
        style: {
          ...current.style,
          w: NOTE_CARD_W,
          h: NOTE_CARD_H,
        },
      });
    },
    [readOnly, findNode, node.id, updateNode],
  );

  /** Altura só do cabeçalho quando colapsado. */
  const NOTE_HEADER_H = 44;

  /** Alterna colapsar/expandir conteúdo e atualiza tamanho do nó. Um único updateNode para não sobrescrever customPayload com nó em closure (commit() usaria referência antiga). */
  const toggleContentCollapsed = useCallback(() => {
    if (readOnly) return;
    const current = findNode(node.id);
    if (!current) return;
    const nextCollapsed = !isContentCollapsed(current.customPayload);
    updateNode({
      ...current,
      customPayload: {
        ...(current.customPayload as NotePayload),
        contentCollapsed: nextCollapsed,
      },
      style: {
        ...current.style,
        w: NOTE_CARD_W,
        h: nextCollapsed ? NOTE_HEADER_H : NOTE_CARD_H,
      },
    });
  }, [readOnly, node.id, findNode, updateNode]);

  /** Com noteId (ex.: mapa do backend): garante tamanho grande via API do nodex (ou pequeno se colapsado). */
  useEffect(() => {
    if (!noteId || readOnly || !logicalNode) return;
    const collapsed = isContentCollapsed(node.customPayload);
    const targetH = collapsed ? NOTE_HEADER_H : NOTE_CARD_H;
    if (node.style.w >= NOTE_CARD_W && node.style.h >= targetH) return;
    logicalNode.chain().updateSize(NOTE_CARD_W, targetH).commit();
  }, [noteId, readOnly, logicalNode, node.style.w, node.style.h, node.customPayload]);

  const content = useMemo(() => {
    if (!noteId) {
      return (
        <div className="flex h-full w-full flex-col justify-center gap-1 overflow-hidden rounded-md border border-dashed border-amber-300/60 bg-ds-surface/80 px-1.5 py-1 dark:border-navy-600 dark:bg-navy-900/50">
          {isLoadingNotes ? (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <LoaderCircle className="size-3 animate-spin" />
              Carregando…
            </div>
          ) : (
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  data-nodex-ui
                  className="h-7 w-full justify-between border-amber-200/60 bg-ds-surface-elevated px-1.5 py-0 text-[11px] text-foreground dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="size-3 shrink-0" />
                  Nota
                  <ChevronDown className="size-3 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="max-h-64 w-[var(--radix-popover-trigger-width)] overflow-auto p-1"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="space-y-0.5">
                  {notes.length === 0 ? (
                    <li className="px-2 py-2 text-xs text-muted-foreground dark:text-navy-400">
                      Nenhuma nota ainda.
                    </li>
                  ) : (
                    notes.map((n) => (
                      <li key={n.id}>
                        <button
                          type="button"
                          className="w-full rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-amber-50 dark:text-navy-200 dark:hover:bg-navy-700"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectNote(n.id);
                            setPickerOpen(false);
                          }}
                        >
                          {n.title || "(sem título)"}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    }

    if (isLoadingNote || !note) {
      return (
        <div className="flex h-full w-full items-center justify-center gap-2 rounded-xl border border-amber-200/60 bg-ds-surface/80 p-4 dark:border-navy-700 dark:bg-navy-900/50">
          <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground dark:text-navy-300">
            Buscando nota na API…
          </span>
        </div>
      );
    }

    const bodyMarkdown = note.text?.trim() ?? "";

    return (
      <div className="flex h-full w-full flex-col overflow-auto rounded-xl border border-amber-200/60 bg-ds-surface-elevated shadow-md dark:border-navy-700 dark:bg-navy-900/95">
        <div
          className="flex shrink-0 items-center gap-1 border-b border-amber-200/60 px-3 py-2 dark:border-navy-700"
          title={note.title}
        >
          <button
            type="button"
            data-nodex-ui
            className="flex shrink-0 items-center justify-center rounded p-0.5 text-muted-foreground hover:bg-amber-100/60 hover:text-foreground dark:text-navy-400 dark:hover:bg-navy-700 dark:hover:text-navy-200"
            onClick={(e) => {
              e.stopPropagation();
              toggleContentCollapsed();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label={contentCollapsed ? "Expandir conteúdo" : "Colapsar conteúdo"}
          >
            {contentCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground dark:text-navy-100">
            {note.title || "(sem título)"}
          </span>
        </div>
        {!contentCollapsed && (
          <div
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 text-sm text-foreground dark:text-navy-200 [&_.notion-editor-content]:min-h-0 [&_.ProseMirror]:min-h-0 [&_.ProseMirror]:p-0"
            data-nodex-ui
            onMouseDown={(e) => e.stopPropagation()}
          >
            {bodyMarkdown ? (
              <Editor
                key={note.id}
                content={bodyMarkdown}
                editable={false}
                className="max-w-none text-inherit"
              />
            ) : (
              <span className="italic text-muted-foreground/60 dark:text-navy-500">
                Sem conteúdo
              </span>
            )}
          </div>
        )}
      </div>
    );
  }, [
    noteId,
    notes,
    isLoadingNotes,
    isLoadingNote,
    note,
    handleSelectNote,
    pickerOpen,
    contentCollapsed,
    toggleContentCollapsed,
  ]);

  if (!logicalNode) return null;

  return (
    <div
      className={cn("group absolute", className)}
      data-nodex-node
      style={{
        transform: `translate(${node.pos.x}px, ${node.pos.y}px)`,
        width: node.style.w + node.style.wrapperPadding * 2,
        height: node.style.h + node.style.wrapperPadding * 2,
        ...style,
      }}
    >
      <div
        className="relative h-full w-full"
        style={{ padding: node.style.wrapperPadding }}
      >
        <div
          className={cn(
            "rounded-xl overflow-auto select-none",
            contentClassName,
          )}
          style={{
            ...contentStyle,
            width: node.style.w,
            height: node.style.h,
            borderColor: node.style.color,
            boxShadow:
              selectedNodeId === node.id
                ? `0 0 0 2px ${node.style.color}`
                : undefined,
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          {content}
        </div>

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 h-[6px] -translate-y-1/2 rounded-md block",
            isLeft ? "right-0" : "left-0",
            selectedNodeId !== node.id ? "block" : "hidden",
          )}
          style={{
            width: node.style.wrapperPadding,
            backgroundColor: node.style.color,
          }}
        />

        {hasChildren && (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1/2 h-[6px] rounded-md -translate-y-1/2",
                isLeft ? "left-0" : "right-0",
              )}
              style={{
                width: node.style.wrapperPadding / 2,
                marginRight: isLeft ? 0 : 12,
                marginLeft: isLeft ? 12 : 0,
                backgroundColor: node.style.color,
              }}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full text-xs flex items-center font-bold justify-center border-2",
                isLeft ? "-left-1.5" : "-right-1.5",
              )}
              style={{
                color: node.style.color,
                borderColor: node.style.color,
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                logicalNode.togglechildrensVisibility();
              }}
            >
              {!childrenVisible && node.childrens.length}
              {childrenVisible && (
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: node.style.color }}
                />
              )}
            </span>
          </>
        )}
      </div>

      {!readOnly && (
        <>
          <button
            type="button"
            className={cn(
              "absolute top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/60 bg-ds-surface-elevated text-sm font-bold text-foreground shadow-sm transition",
              selectedNodeId === node.id ? "flex" : "hidden",
              isLeft ? "-left-2.5" : "-right-2.5",
            )}
            style={{ borderColor: node.style.color, color: node.style.color }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              logicalNode.addChild();
            }}
            aria-label="Adicionar node"
          >
            +
          </button>
          <button
            type="button"
            className={cn(
              "absolute top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 shadow-sm transition",
              selectedNodeId === node.id ? "flex" : "hidden",
              isLeft ? "-right-3" : "-left-3",
            )}
            style={{ borderColor: node.style.color, color: node.style.color }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              logicalNode.destroy();
            }}
            aria-label="Remover node"
          >
            X
          </button>
        </>
      )}
    </div>
  );
}
