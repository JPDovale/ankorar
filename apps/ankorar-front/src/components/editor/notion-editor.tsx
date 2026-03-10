import { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TableKit } from "@tiptap/extension-table/kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import { Markdown } from "@tiptap/markdown";
import { common, createLowlight } from "lowlight";
import { cn } from "@/lib/utils";
import { BubbleToolbar } from "./bubble-toolbar";
import { SlashCommandMenu } from "./slash-command-menu";
import { TableControls } from "./table-controls";
import { MathEditorDialog } from "./math-editor-dialog";
import { NoteLink } from "./note-link-extension";
import { NoteLinkSuggestion } from "./note-link-suggestion";
import { NoteLinkHoverPreview } from "./note-link-hover-preview";
import "katex/dist/katex.min.css";
import "./notion-editor.css";

const lowlight = createLowlight(common);

interface EditorProps {
  content?: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function Editor({
  content = "",
  onChange,
  placeholder = "Pressione '/' para inserir blocos...",
  className,
  editable = true,
}: EditorProps) {
  const [mathDialog, setMathDialog] = useState<{
    open: boolean;
    mode: "inline" | "block";
    initialLatex: string;
    editPos: number | null;
  }>({ open: false, mode: "inline", initialLatex: "", editPos: null });

  const openMathDialog = useCallback(
    (
      mode: "inline" | "block",
      initialLatex = "",
      editPos: number | null = null,
    ) => {
      setMathDialog({ open: true, mode, initialLatex, editPos });
    },
    [],
  );

  const editorRootRef = useRef<HTMLDivElement | null>(null);
  const [editorRoot, setEditorRoot] = useState<HTMLElement | null>(null);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const setEditorRootRef = useCallback((el: HTMLDivElement | null) => {
    editorRootRef.current = el;
    setEditorRoot(el);
  }, []);

  const handleKeyDown = useCallback((view: { state: unknown; dispatch: (tr: unknown) => void }, event: KeyboardEvent) => {
    const ed = editorRef.current;
    if (!ed?.isActive?.("noteLink")) return false;
    const state = view.state as {
      doc: { textBetween: (a: number, b: number) => string; nodesBetween: (from: number, to: number, f: (n: { isText: boolean; marks: readonly { type: unknown }[]; nodeSize: number }, pos: number) => void) => void };
      selection: { from: number };
      schema: { marks: { noteLink: unknown }; text: (s: string) => unknown };
      tr: { delete: (a: number, b: number) => unknown; insert: (pos: number, node: unknown) => unknown; setSelection: (s: unknown) => unknown; doc: unknown };
    };
    const { from } = state.selection;
    const markType = ed.state.schema.marks.noteLink;
    let linkEnd: number | null = null;
    state.doc.nodesBetween(Math.max(0, from - 1), from + 1, (node, pos) => {
      if (node.isText && node.marks.some((m) => m.type === markType)) {
        linkEnd = pos + node.nodeSize;
        return false;
      }
    });
    if (linkEnd === null) return false;

    if (event.key === "Enter") {
      event.preventDefault();
      ed.chain().setTextSelection(linkEnd).insertContent({ type: "paragraph" }).focus().run();
      return true;
    }
    if (event.key === " ") {
      const charBefore = state.doc.textBetween(Math.max(0, from - 1), from);
      if (charBefore === " ") {
        event.preventDefault();
        type Tr = { delete: (a: number, b: number) => Tr; insert: (pos: number, node: unknown) => Tr; setSelection: (s: unknown) => Tr; doc: { nodeSize: number }; };
        const tr = (state.tr as Tr).delete(from - 1, from).insert(from - 1, state.schema.text("  "));
        tr.setSelection(TextSelection.create(tr.doc as Parameters<typeof TextSelection.create>[0], from + 1));
        view.dispatch(tr);
        return true;
      }
    }
    return false;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Highlight.configure({ multicolor: false }),
      Typography,
      UnderlineExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      TableKit.configure({
        table: { resizable: true },
      }),
      NoteLink,
      Mathematics.configure({
        katexOptions: {
          throwOnError: false,
          macros: {
            "\\R": "\\mathbb{R}",
            "\\N": "\\mathbb{N}",
            "\\Z": "\\mathbb{Z}",
            "\\Q": "\\mathbb{Q}",
          },
        },
        inlineOptions: {
          onClick: (node, pos) => {
            openMathDialog("inline", node.attrs.latex, pos);
          },
        },
        blockOptions: {
          onClick: (node, pos) => {
            openMathDialog("block", node.attrs.latex, pos);
          },
        },
      }),
      Markdown.configure({
        markedOptions: { gfm: true, breaks: true },
      }),
    ],
    content,
    contentType: "markdown",
    editable,
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getMarkdown());
    },
    editorProps: {
      attributes: {
        class: "notion-editor-content",
      },
      handleKeyDown: (view: unknown, event: KeyboardEvent) => handleKeyDown(view as Parameters<typeof handleKeyDown>[0], event),
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const handleMathConfirm = useCallback(
    (latex: string) => {
      if (!editor) return;

      if (mathDialog.editPos !== null) {
        if (mathDialog.mode === "inline") {
          editor
            .chain()
            .setNodeSelection(mathDialog.editPos)
            .updateInlineMath({ latex })
            .focus()
            .run();
        } else {
          editor
            .chain()
            .setNodeSelection(mathDialog.editPos)
            .updateBlockMath({ latex })
            .focus()
            .run();
        }
      } else {
        if (mathDialog.mode === "inline") {
          editor.chain().focus().insertInlineMath({ latex }).run();
        } else {
          editor.chain().focus().insertBlockMath({ latex }).run();
        }
      }
    },
    [editor, mathDialog.editPos, mathDialog.mode],
  );

  return (
    <div
      ref={setEditorRootRef}
      className={cn(
        "notion-editor relative mx-auto w-full max-w-3xl",
        className,
      )}
    >
      {editor && editable && <BubbleToolbar editor={editor} />}
      {editor && editable && (
        <SlashCommandMenu
          editor={editor}
          onInsertInlineMath={() => openMathDialog("inline")}
          onInsertBlockMath={() => openMathDialog("block")}
        />
      )}
      {editor && editable && <NoteLinkSuggestion editor={editor} />}
      {editor && editable && <TableControls editor={editor} />}

      <EditorContent editor={editor} />

      {editable && <NoteLinkHoverPreview editorRoot={editorRoot} />}

      <MathEditorDialog
        open={mathDialog.open}
        onOpenChange={(open) => setMathDialog((prev) => ({ ...prev, open }))}
        initialLatex={mathDialog.initialLatex}
        onConfirm={handleMathConfirm}
        mode={mathDialog.mode}
      />
    </div>
  );
}
