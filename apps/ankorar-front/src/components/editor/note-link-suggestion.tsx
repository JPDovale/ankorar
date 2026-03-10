import {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/useNotes";
import type { NotePreview } from "@/services/notes/listNotesRequest";
import { FileText } from "lucide-react";

const TRIGGER = "[[";
const TRIGGER_LEN = TRIGGER.length;

interface NoteLinkSuggestionProps {
  editor: Editor;
}

export function NoteLinkSuggestion({ editor }: NoteLinkSuggestionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [linkRange, setLinkRange] = useState<{ from: number; to: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const didInsertBrackets = useRef(false);

  const { notes } = useNotes();

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(0);
    setLinkRange(null);
    didInsertBrackets.current = false;
  }, []);

  const insertNoteLink = useCallback(
    (note: NotePreview) => {
      if (!linkRange) return;
      const { from, to } = linkRange;
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContentAt(from, {
          type: "text",
          text: note.title,
          marks: [
            {
              type: "noteLink",
              attrs: { id: note.id, title: note.title },
            },
          ],
        })
        .run();
      close();
    },
    [editor, linkRange, close],
  );

  useEffect(() => {
    const handleUpdate = () => {
      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        "\n",
      );

      if (textBefore.endsWith(TRIGGER)) {
        const matchStart = from - TRIGGER_LEN;
        setLinkRange({ from: matchStart, to: from + 2 });

        if (!didInsertBrackets.current) {
          didInsertBrackets.current = true;
          editor
            .chain()
            .focus()
            .insertContent("]]")
            .setTextSelection(from)
            .run();
          setLinkRange({ from: matchStart, to: from + 2 });
        }

        const coords = editor.view.coordsAtPos(from);
        const editorRect = editor.view.dom
          .closest(".notion-editor")
          ?.getBoundingClientRect();
        if (editorRect) {
          setPosition({
            top: coords.bottom - editorRect.top + 8,
            left: coords.left - editorRect.left,
          });
        }

        setSelectedIndex(0);
        setIsOpen(true);
      } else if (isOpen && linkRange) {
        const textInRange = state.doc.textBetween(linkRange.from, linkRange.to, "\n");
        if (textInRange !== "[[]]") {
          close();
        }
      } else {
        didInsertBrackets.current = false;
        if (isOpen) close();
      }
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor, isOpen, linkRange, close]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(notes.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) =>
            (i - 1 + Math.max(notes.length, 1)) % Math.max(notes.length, 1),
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const note = notes[selectedIndex];
        if (note) insertNoteLink(note);
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (linkRange) {
          editor
            .chain()
            .focus()
            .deleteRange(linkRange)
            .run();
        }
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, notes, selectedIndex, insertNoteLink, close, linkRange, editor]);

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const el = menuRef.current;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom > viewH - 16) {
      el.style.maxHeight = `${viewH - rect.top - 16}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute z-50 w-72 overflow-y-auto rounded-xl border py-1.5",
        "bg-ds-surface-elevated border-border/60 shadow-lg",
        "dark:bg-navy-900 dark:border-navy-700/60",
        "animate-in fade-in-0 slide-in-from-top-1 duration-150",
      )}
      style={{
        top: position.top,
        left: position.left,
        maxHeight: 320,
      }}
    >
      <div className="px-2.5 py-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Vincular nota
        </span>
      </div>
      {notes.length === 0 ? (
        <div className="px-2.5 py-4 text-center text-sm text-text-muted">
          Nenhuma nota encontrada.
        </div>
      ) : (
        notes.map((note, idx) => (
          <button
            key={note.id}
            type="button"
            className={cn(
              "flex w-full items-center gap-3 px-2.5 py-2 text-left transition-colors",
              "hover:bg-amber-400/8 dark:hover:bg-amber-400/6",
              idx === selectedIndex && "bg-amber-400/12 dark:bg-amber-400/10",
            )}
            onClick={() => insertNoteLink(note)}
            onMouseEnter={() => setSelectedIndex(idx)}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                "bg-navy-100/60 text-navy-500",
                "dark:bg-navy-800 dark:text-navy-300",
                idx === selectedIndex &&
                  "bg-amber-400/15 text-amber-600 dark:bg-amber-400/12 dark:text-amber-300",
              )}
            >
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-text-primary">
                {note.title || "Sem título"}
              </div>
              {note.text && (
                <div className="line-clamp-1 truncate text-xs text-text-muted">
                  {note.text.replace(/\n/g, " ").slice(0, 60)}…
                </div>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );
}
