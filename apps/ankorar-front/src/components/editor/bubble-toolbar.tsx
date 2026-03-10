import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface BubbleToolbarProps {
  editor: Editor;
}

interface ToolbarItem {
  icon: React.ElementType;
  label: string;
  action: () => void;
  isActive: () => boolean;
}

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  const formatItems: ToolbarItem[] = [
    {
      icon: Bold,
      label: "Negrito",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: "Italico",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: Underline,
      label: "Sublinhado",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: Strikethrough,
      label: "Tachado",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: Highlighter,
      label: "Destaque",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      icon: Code,
      label: "Codigo inline",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
  ];

  const alignItems: ToolbarItem[] = [
    {
      icon: AlignLeft,
      label: "Esquerda",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
    },
    {
      icon: AlignCenter,
      label: "Centro",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
    },
    {
      icon: AlignRight,
      label: "Direita",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
    },
  ];

  const toggleCn = cn(
    "h-7 w-7 p-0 text-navy-100/80 hover:text-white hover:bg-white/10",
    "data-[state=on]:bg-amber-400/20 data-[state=on]:text-amber-300",
  );

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "top",
        offset: 8,
      }}
      shouldShow={({ state }) => {
        const { from, to } = state.selection;
        return from !== to;
      }}
    >
      <div
        className={cn(
          "flex items-center gap-0.5 rounded-lg px-1.5 py-1",
          "bg-navy-900/95 border border-navy-700/60 shadow-xl",
          "backdrop-blur-sm",
          "animate-in fade-in-0 zoom-in-95 duration-150",
        )}
      >
        {formatItems.map((item) => (
          <Toggle
            key={item.label}
            size="sm"
            pressed={item.isActive()}
            onPressedChange={() => item.action()}
            aria-label={item.label}
            title={item.label}
            className={toggleCn}
          >
            <item.icon className="size-3.5" />
          </Toggle>
        ))}

        <Separator orientation="vertical" className="mx-0.5 h-4 bg-navy-600" />

        {alignItems.map((item) => (
          <Toggle
            key={item.label}
            size="sm"
            pressed={item.isActive()}
            onPressedChange={() => item.action()}
            aria-label={item.label}
            title={item.label}
            className={toggleCn}
          >
            <item.icon className="size-3.5" />
          </Toggle>
        ))}
      </div>
    </BubbleMenu>
  );
}
