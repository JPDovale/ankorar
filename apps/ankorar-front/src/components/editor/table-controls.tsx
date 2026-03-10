import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  ArrowUpFromLine,
  ArrowDownFromLine,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Columns2,
  Rows2,
} from "lucide-react";

interface TableControlsProps {
  editor: Editor;
}

interface ControlButton {
  icon: React.ElementType;
  label: string;
  action: () => void;
  variant?: "default" | "danger";
}

const HIDE_DELAY_MS = 800;

export function TableControls({ editor }: TableControlsProps) {
  const [visible, setVisible] = useState(false);
  const [tableRect, setTableRect] = useState<DOMRect | null>(null);
  const [tableRectViewport, setTableRectViewport] = useState<DOMRect | null>(
    null,
  );
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const tableElRef = useRef<HTMLTableElement | null>(null);
  const controlsRootRef = useRef<HTMLDivElement>(null);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
  }, [cancelHide]);

  const recalcRect = useCallback((tableEl: HTMLTableElement) => {
    const editorEl = tableEl.closest(".notion-editor");
    if (!editorEl) return;
    const tRect = tableEl.getBoundingClientRect();
    const eRect = editorEl.getBoundingClientRect();
    setTableRectViewport(
      new DOMRect(tRect.left, tRect.top, tRect.width, tRect.height),
    );
    setTableRect(
      new DOMRect(
        tRect.left - eRect.left,
        tRect.top - eRect.top,
        tRect.width,
        tRect.height,
      ),
    );
  }, []);

  useEffect(() => {
    const editorDom = editor.view.dom;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tableEl = target.closest("table") as HTMLTableElement | null;
      if (tableEl && editorDom.contains(tableEl)) {
        tableElRef.current = tableEl;
        recalcRect(tableEl);
        cancelHide();
        setVisible(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related) {
        scheduleHide();
        return;
      }
      const stillInTable = related.closest("table") === tableElRef.current;
      const stillInControls = controlsRootRef.current?.contains(related);
      if (!stillInTable && !stillInControls) {
        scheduleHide();
      }
    };

    editorDom.addEventListener("mouseover", onMouseOver);
    editorDom.addEventListener("mouseout", onMouseOut);

    return () => {
      editorDom.removeEventListener("mouseover", onMouseOver);
      editorDom.removeEventListener("mouseout", onMouseOut);
      cancelHide();
    };
  }, [editor, recalcRect, cancelHide, scheduleHide]);

  useEffect(() => {
    if (!visible || !tableElRef.current) return;
    const onUpdate = () => {
      if (tableElRef.current?.isConnected) {
        recalcRect(tableElRef.current);
      } else {
        setVisible(false);
      }
    };
    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor, visible, recalcRect]);

  useEffect(() => {
    if (!visible || !tableElRef.current) return;
    const scrollContainer =
      editor.view.dom.closest("main") ?? document.documentElement;
    const updateRect = () => {
      if (tableElRef.current?.isConnected) recalcRect(tableElRef.current);
    };
    scrollContainer.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      scrollContainer.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [visible, editor.view.dom, recalcRect]);

  const handleControlsEnter = () => cancelHide();
  const handleControlsLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    const stillInTable = related && tableElRef.current?.contains(related);
    const stillInControls =
      related && controlsRootRef.current?.contains(related);
    if (!stillInTable && !stillInControls) {
      scheduleHide();
    }
  };

  if (!visible || !tableRect || !tableRectViewport) return null;

  const rowActions: ControlButton[] = [
    {
      icon: ArrowUpFromLine,
      label: "Linha acima",
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: ArrowDownFromLine,
      label: "Linha abaixo",
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: Trash2,
      label: "Excluir linha",
      action: () => editor.chain().focus().deleteRow().run(),
      variant: "danger",
    },
  ];

  const colActions: ControlButton[] = [
    {
      icon: ArrowLeftFromLine,
      label: "Coluna esquerda",
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: ArrowRightFromLine,
      label: "Coluna direita",
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: Trash2,
      label: "Excluir coluna",
      action: () => editor.chain().focus().deleteColumn().run(),
      variant: "danger",
    },
  ];

  const tableActions: ControlButton[] = [
    {
      icon: Rows2,
      label: "Header linha",
      action: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      icon: Columns2,
      label: "Header coluna",
      action: () => editor.chain().focus().toggleHeaderColumn().run(),
    },
    {
      icon: Trash2,
      label: "Excluir tabela",
      action: () => editor.chain().focus().deleteTable().run(),
      variant: "danger",
    },
  ];

  const PAD = 20;
  const PANEL_W = 148;

  const panelLeft = tableRectViewport.left - PAD - PANEL_W - 8;
  const panelTop = tableRectViewport.top - PAD;

  const controlsContent = (
    <div
      ref={controlsRootRef}
      onMouseEnter={handleControlsEnter}
      onMouseLeave={handleControlsLeave}
      className="pointer-events-none fixed z-[100]"
      style={{
        top: panelTop,
        left: panelLeft,
        width: tableRect.width + PAD * 2 + PANEL_W + 8,
        height: tableRect.height + PAD * 2,
      }}
    >
      {/* Painel de controles a esquerda, ancorado no topo */}
      <div
        className={cn(
          "pointer-events-auto absolute top-[20px] left-0 z-[100] flex w-[148px] flex-col gap-2 rounded-xl px-2 py-2",
          "bg-ds-surface-elevated border border-border/60 shadow-lg",
          "dark:bg-navy-900 dark:border-navy-700/60",
          "animate-in fade-in-0 slide-in-from-right-2 duration-150",
        )}
      >
        <ControlGroup label="Linha" actions={rowActions} />
        <div className="h-px w-full bg-border/40" />
        <ControlGroup label="Coluna" actions={colActions} />
        <div className="h-px w-full bg-border/40" />
        <ControlGroup label="Tabela" actions={tableActions} />
      </div>

      {/* Botao + coluna a direita */}
      <button
        type="button"
        title="Adicionar coluna"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className={cn(
          "pointer-events-auto absolute z-10 flex size-7 items-center justify-center",
          "rounded-full border bg-ds-surface-elevated shadow-sm",
          "border-border/60 text-text-muted",
          "hover:border-amber-400/40 hover:text-amber-600 hover:shadow-md",
          "dark:bg-navy-900 dark:border-navy-700/60 dark:hover:text-amber-300",
          "transition-all duration-150",
          "animate-in fade-in-0 duration-150",
        )}
        style={{
          top: PAD + tableRect.height / 2 - 14,
          right: 0,
        }}
      >
        <Plus className="size-3.5" />
      </button>

      {/* Botao + linha embaixo */}
      <button
        type="button"
        title="Adicionar linha"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className={cn(
          "pointer-events-auto absolute z-10 flex size-7 items-center justify-center",
          "rounded-full border bg-ds-surface-elevated shadow-sm",
          "border-border/60 text-text-muted",
          "hover:border-amber-400/40 hover:text-amber-600 hover:shadow-md",
          "dark:bg-navy-900 dark:border-navy-700/60 dark:hover:text-amber-300",
          "transition-all duration-150",
          "animate-in fade-in-0 duration-150",
        )}
        style={{
          bottom: 0,
          left: PANEL_W + 8 + PAD + tableRect.width / 2 - 14,
        }}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );

  return createPortal(controlsContent, document.body);
}

function ControlGroup({
  label,
  actions,
}: {
  label: string;
  actions: ControlButton[];
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted/60">
        {label}
      </span>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            action.action();
          }}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap",
            action.variant === "danger"
              ? "text-ds-danger/70 hover:bg-ds-danger/10 hover:text-ds-danger"
              : "text-text-secondary hover:bg-amber-400/10 hover:text-amber-600 dark:hover:text-amber-300",
          )}
        >
          <action.icon className="size-3 shrink-0" />
          {action.label}
        </button>
      ))}
    </div>
  );
}
