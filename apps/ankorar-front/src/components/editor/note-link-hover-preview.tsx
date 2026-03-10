import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getNoteRequest } from "@/services/notes/getNoteRequest";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PREVIEW_OFFSET = 12;
const PREVIEW_WIDTH = 360;
const PREVIEW_MAX_HEIGHT = 420;

interface NoteLinkHoverPreviewProps {
  editorRoot: HTMLElement | null;
}

async function fetchNoteContent(noteId: string): Promise<{ title: string; text: string } | null> {
  const response = await getNoteRequest(noteId);
  if (response.status === 200 && response.data?.note) {
    const { title, text } = response.data.note;
    return { title, text };
  }
  return null;
}

export function NoteLinkHoverPreview({ editorRoot }: NoteLinkHoverPreviewProps) {
  const [anchor, setAnchor] = useState<{
    noteId: string;
    rect: DOMRect;
  } | null>(null);
  const hoverRef = useRef<{ noteId: string; timeoutId: number } | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const { data: noteContent, isLoading } = useQuery({
    queryKey: ["note-preview", anchor?.noteId],
    queryFn: () => fetchNoteContent(anchor?.noteId ?? ""),
    enabled: Boolean(anchor?.noteId),
    staleTime: 60 * 1000,
  });

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".note-link") as HTMLElement | null;
      if (!target || !editorRoot) return;
      const noteId = target.getAttribute("data-note-id");
      if (!noteId) return;

      if (hoverRef.current?.timeoutId) {
        window.clearTimeout(hoverRef.current.timeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        const rect = target.getBoundingClientRect();
        setAnchor({ noteId, rect });
      }, 400);

      hoverRef.current = { noteId, timeoutId };
    },
    [editorRoot],
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest?.(".note-link-preview-portal")) return;
      if (related?.closest?.(".note-link")) return;

      if (hoverRef.current?.timeoutId) {
        window.clearTimeout(hoverRef.current.timeoutId);
        hoverRef.current = null;
      }
      closeTimeoutRef.current = window.setTimeout(() => setAnchor(null), 120);
    },
    [],
  );

  const handlePreviewMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handlePreviewMouseLeave = useCallback(() => {
    setAnchor(null);
  }, []);

  useEffect(() => {
    if (!editorRoot) return;
    editorRoot.addEventListener("mouseover", handleMouseOver, true);
    editorRoot.addEventListener("mouseout", handleMouseOut, true);
    return () => {
      editorRoot.removeEventListener("mouseover", handleMouseOver, true);
      editorRoot.removeEventListener("mouseout", handleMouseOut, true);
      if (hoverRef.current?.timeoutId) {
        window.clearTimeout(hoverRef.current.timeoutId);
      }
    };
  }, [editorRoot, handleMouseOver, handleMouseOut]);

  if (!anchor) return null;

  const left = anchor.rect.right + PREVIEW_OFFSET;
  const top = anchor.rect.top;
  const style: React.CSSProperties = {
    position: "fixed",
    left,
    top,
    width: PREVIEW_WIDTH,
    maxHeight: PREVIEW_MAX_HEIGHT,
    zIndex: 100,
  };

  const previewContent = (
    <div
      className={cn(
        "note-link-preview-portal overflow-hidden rounded-xl border bg-ds-surface-elevated shadow-lg",
        "border-border/60 dark:border-navy-700/60 dark:bg-navy-900",
      )}
      style={style}
      onMouseEnter={handlePreviewMouseEnter}
      onMouseLeave={handlePreviewMouseLeave}
    >
      <div className="border-b border-border/60 px-3 py-2 dark:border-navy-700/60">
        <div className="truncate text-sm font-semibold text-text-primary">
          {noteContent?.title ?? "…"}
        </div>
      </div>
      <div className="overflow-y-auto p-3" style={{ maxHeight: PREVIEW_MAX_HEIGHT - 52 }}>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-200/80 dark:bg-navy-700/50" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-200/80 dark:bg-navy-700/50" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200/80 dark:bg-navy-700/50" />
          </div>
        ) : noteContent?.text ? (
          <div className="prose prose-sm dark:prose-invert notion-editor-content max-w-none text-text-secondary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{noteContent.text}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-text-muted">Conteúdo indisponível.</p>
        )}
      </div>
    </div>
  );

  return createPortal(previewContent, document.body);
}
