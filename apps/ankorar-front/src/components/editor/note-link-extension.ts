import {
  Mark,
  mergeAttributes,
  type MarkdownToken,
  type MarkdownParseHelpers,
  type MarkdownRendererHelpers,
  type JSONContent,
} from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

export interface NoteLinkOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    noteLink: {
      setNoteLink: (attrs: { id: string; title: string }) => ReturnType;
      unsetNoteLink: () => ReturnType;
    };
  }
}

const NOTE_LINK_REGEX = /^\[\[([^\]|]+)\|([^\]]*)\]\]/;

export const NoteLink = Mark.create<NoteLinkOptions>({
  name: "noteLink",
  priority: 300,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-note-id"),
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs.id) return {};
          return { "data-note-id": attrs.id };
        },
      },
      title: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-note-title"),
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs.title) return {};
          return { "data-note-title": attrs.title };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-note-id][data-type="note-link"]',
      },
      {
        tag: "span.note-link",
        getAttrs: (node: HTMLElement) => {
          const id = node.getAttribute("data-note-id");
          const title = node.getAttribute("data-note-title");
          if (!id) return false;
          return { id, title: title ?? "" };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      "span",
      mergeAttributes(
        { "data-type": "note-link", class: "note-link" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addKeyboardShortcuts() {
    const markType = this.type;
    const findLinkEnd = (
      state: { doc: { nodesBetween: (from: number, to: number, f: (node: { isText: boolean; marks: readonly { type: unknown }[]; nodeSize: number }, pos: number) => boolean | void) => void }; selection: { from: number } },
      from: number,
    ): number | null => {
      let linkEnd: number | null = null;
      const start = Math.max(0, from - 1);
      const end = from + 1;
      state.doc.nodesBetween(start, end, (node, pos) => {
        if (node.isText && node.marks.some((m) => m.type === markType)) {
          linkEnd = pos + node.nodeSize;
          return false;
        }
      });
      return linkEnd;
    };
    return {
      "Mod-k": () => this.editor.commands.setNoteLink({ id: "", title: "" }),
      Enter: ({ editor }) => {
        const { state } = editor;
        const { from } = state.selection;
        const linkEnd = findLinkEnd(state, from);
        if (linkEnd === null) return false;
        return editor
          .chain()
          .setTextSelection(linkEnd)
          .insertContent({ type: "paragraph" })
          .focus()
          .run();
      },
      " ": ({ editor }) => {
        const { state } = editor;
        const { from } = state.selection;
        const noteLinkType = state.schema.marks.noteLink;
        if (!noteLinkType) return false;
        const linkEnd = findLinkEnd(state, from);
        if (linkEnd === null) return false;
        const charBefore = state.doc.textBetween(Math.max(0, from - 1), from);
        if (charBefore !== " ") return false;
        const tr = state.tr.delete(from - 1, from);
        const insertPos = from - 1;
        tr.insert(insertPos, state.schema.text("  "));
        tr.setSelection(TextSelection.create(tr.doc, insertPos + 2));
        editor.view.dispatch(tr);
        return true;
      },
    };
  },

  addCommands() {
    return {
      setNoteLink:
        (attrs: { id: string; title: string }) =>
        ({
          chain,
        }: {
          chain: () => {
            setMark: (
              n: string,
              a: Record<string, string>,
            ) => { run: () => boolean };
            run: () => boolean;
          };
        }) =>
          chain().setMark(this.name, attrs).run(),

      unsetNoteLink:
        () =>
        ({
          chain,
        }: {
          chain: () => { unsetMark: (n: string) => { run: () => boolean } };
        }) =>
          chain().unsetMark(this.name).run(),
    };
  },

  // Markdown: tokenizer para [[id|title]]
  markdownTokenizer: {
    name: "noteLink",
    level: "inline" as const,

    start: (src: string) => src.indexOf("[["),

    tokenize: (src: string) => {
      const match = NOTE_LINK_REGEX.exec(src);
      if (!match) return undefined;
      const [, id, title] = match;
      return {
        type: "noteLink",
        raw: match[0],
        noteId: id ?? "",
        noteTitle: (title ?? "").trim(),
      };
    },
  },

  parseMarkdown: (token: MarkdownToken, helpers: MarkdownParseHelpers) => {
    const id = (token as MarkdownToken & { noteId?: string }).noteId ?? "";
    const title =
      (token as MarkdownToken & { noteTitle?: string }).noteTitle ?? "";
    const content: JSONContent[] = [{ type: "text", text: title }];
    return helpers.applyMark("noteLink", content, { id, title });
  },

  // Serialização para o backend: sempre enviar exatamente [[id|titulo]] (visível na UI só o titulo).
  // Importante: quando o TipTap chama com nó sintético (content = [placeholder]), precisamos usar
  // o resultado de renderChildren(content) para que getMarkOpening/getMarkClosing extraiam [[id| e ]].
  renderMarkdown: (node: JSONContent, helpers: MarkdownRendererHelpers) => {
    const attrs =
      (node.attrs as { id?: string; title?: string } | undefined) ??
      (
        node.marks as
          | Array<{ type: string; attrs?: { id?: string; title?: string } }>
          | undefined
      )?.find((m) => m.type === "noteLink")?.attrs;
    const id = attrs?.id ?? "";
    const content = node.content ?? [];
    const renderedContent = content.length
      ? helpers.renderChildren(content)
      : "";
    const title = renderedContent || (attrs?.title ?? "");
    return `[[${id}|${title}]]`;
  },
});
