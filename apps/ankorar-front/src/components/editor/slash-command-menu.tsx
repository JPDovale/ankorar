import {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  CodeSquare,
  Minus,
  Type,
  Table,
  Sigma,
  Pi,
} from "lucide-react";

interface SlashCommandItem {
  icon: React.ElementType;
  label: string;
  description: string;
  action: (editor: Editor, callbacks?: SlashCommandCallbacks) => void;
  keywords: string[];
}

interface SlashCommandCallbacks {
  onInsertInlineMath?: () => void;
  onInsertBlockMath?: () => void;
}

const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    icon: Type,
    label: "Texto",
    description: "Parágrafo de texto simples",
    action: (editor) => editor.chain().focus().setParagraph().run(),
    keywords: ["texto", "paragrafo", "text", "paragraph"],
  },
  {
    icon: Heading1,
    label: "Titulo 1",
    description: "Titulo de secao grande",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    keywords: ["titulo", "heading", "h1", "titulo1"],
  },
  {
    icon: Heading2,
    label: "Titulo 2",
    description: "Titulo de secao medio",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    keywords: ["titulo", "heading", "h2", "titulo2"],
  },
  {
    icon: Heading3,
    label: "Titulo 3",
    description: "Titulo de subsecao",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    keywords: ["titulo", "heading", "h3", "titulo3"],
  },
  {
    icon: List,
    label: "Lista",
    description: "Lista com marcadores",
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    keywords: ["lista", "bullet", "ul", "marcadores"],
  },
  {
    icon: ListOrdered,
    label: "Lista numerada",
    description: "Lista com numeros",
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    keywords: ["lista", "numerada", "ordered", "ol", "numeros"],
  },
  {
    icon: ListTodo,
    label: "Lista de tarefas",
    description: "Lista com checkboxes",
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    keywords: ["tarefa", "task", "todo", "checkbox"],
  },
  {
    icon: Quote,
    label: "Citacao",
    description: "Bloco de citacao",
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    keywords: ["citacao", "quote", "blockquote"],
  },
  {
    icon: CodeSquare,
    label: "Bloco de codigo",
    description: "Bloco com syntax highlight",
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    keywords: ["codigo", "code", "pre", "bloco"],
  },
  {
    icon: Table,
    label: "Tabela",
    description: "Tabela com linhas e colunas",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
    keywords: ["tabela", "table", "grid", "celula"],
  },
  {
    icon: Sigma,
    label: "Expressao matematica",
    description: "Formula inline em LaTeX",
    action: (_editor, callbacks) => callbacks?.onInsertInlineMath?.(),
    keywords: ["math", "matematica", "formula", "latex", "equacao", "inline"],
  },
  {
    icon: Pi,
    label: "Bloco matematico",
    description: "Equacao centralizada em LaTeX",
    action: (_editor, callbacks) => callbacks?.onInsertBlockMath?.(),
    keywords: [
      "math",
      "matematica",
      "formula",
      "latex",
      "equacao",
      "bloco",
      "block",
    ],
  },
  {
    icon: Minus,
    label: "Separador",
    description: "Linha horizontal",
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    keywords: ["separador", "linha", "horizontal", "divider", "hr"],
  },
];

interface SlashCommandMenuProps {
  editor: Editor;
  onInsertInlineMath?: () => void;
  onInsertBlockMath?: () => void;
}

export function SlashCommandMenu({
  editor,
  onInsertInlineMath,
  onInsertBlockMath,
}: SlashCommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [slashPos, setSlashPos] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = SLASH_COMMANDS.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q))
    );
  });

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
    setSlashPos(null);
  }, []);

  const executeCommand = useCallback(
    (cmd: SlashCommandItem) => {
      if (slashPos === null) return;
      const to = editor.state.selection.from;
      editor.chain().focus().deleteRange({ from: slashPos, to }).run();
      cmd.action(editor, { onInsertInlineMath, onInsertBlockMath });
      close();
    },
    [editor, slashPos, close, onInsertInlineMath, onInsertBlockMath],
  );

  useEffect(() => {
    const handleUpdate = () => {
      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 50),
        from,
        "\n",
      );

      const slashMatch = textBefore.match(/\/([^\s/]*)$/);
      if (slashMatch) {
        const matchStart = from - slashMatch[0].length;
        setSlashPos(matchStart);
        setQuery(slashMatch[1]);
        setSelectedIndex(0);

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

        setIsOpen(true);
      } else if (isOpen) {
        close();
      }
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor, isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) =>
            (i - 1 + Math.max(filtered.length, 1)) %
            Math.max(filtered.length, 1),
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeCommand(filtered[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, filtered, selectedIndex, executeCommand, close]);

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const el = menuRef.current;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom > viewH - 16) {
      el.style.maxHeight = `${viewH - rect.top - 16}px`;
    }
  }, [isOpen, position]);

  if (!isOpen || filtered.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute z-50 w-64 overflow-y-auto rounded-xl border py-1.5",
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
          Blocos
        </span>
      </div>
      {filtered.map((cmd, idx) => (
        <button
          key={cmd.label}
          type="button"
          className={cn(
            "flex w-full items-center gap-3 px-2.5 py-2 text-left transition-colors",
            "hover:bg-amber-400/8 dark:hover:bg-amber-400/6",
            idx === selectedIndex && "bg-amber-400/12 dark:bg-amber-400/10",
          )}
          onClick={() => executeCommand(cmd)}
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
            <cmd.icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-text-primary">
              {cmd.label}
            </div>
            <div className="truncate text-xs text-text-muted">
              {cmd.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
