import type { CSSProperties } from "react";
import { type MindMapNodeFontSize, useMindMapState } from "../../state/mindMap";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Highlighter,
  Image,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useShallow } from "zustand/react/shallow";
import { useMindMapNode } from "../../hooks/mindMap/useMindMapNode";
import { useMindMapNodeEditorContext } from "../../contexts/MindMapNodeEditorContext";
import { cn } from "../../lib/utils";

/** Opção de cor para o seletor (valor hex ou "transparent"; label opcional) */
export interface NodeStylePopoverColorOption {
  value: string;
  label?: string;
}

/** Slots para estilizar a barra de edição dos nós (ex.: integrar com tema da aplicação) */
export interface NodeStylePopoverStyleSlots {
  /** Classe da barra de edição (wrapper) */
  className?: string;
  /** Conteúdo do popover (painel flutuante) */
  contentClassName?: string;
  contentStyle?: CSSProperties;
  /** Botões da barra (ações customizadas, ícone de imagem, etc.) */
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  /** Itens do toggle (B, I, H1, alinhamento, etc.) */
  toggleItemClassName?: string;
  /** Trigger dos selects (cor texto, cor fundo) */
  selectTriggerClassName?: string;
  /** Conteúdo dropdown dos selects */
  selectContentClassName?: string;
  /** Cores para o texto das células. Quando fornecido, substitui a lista padrão. */
  textColors?: NodeStylePopoverColorOption[];
  /** Cores para o fundo das células. Quando fornecido, substitui a lista padrão. Pode incluir "transparent". */
  backgroundColors?: NodeStylePopoverColorOption[];
}

const DEFAULT_TEXT_COLORS: NodeStylePopoverColorOption[] = [
  { value: "#0f172a", label: "Preto" },
  { value: "#1f2937", label: "Cinza" },
  { value: "#991b1b", label: "Vermelho" },
  { value: "#9a3412", label: "Laranja" },
  { value: "#a16207", label: "Amarelo" },
  { value: "#166534", label: "Verde" },
  { value: "#1e40af", label: "Azul" },
  { value: "#3730a3", label: "Indigo" },
  { value: "#6b21a8", label: "Roxo" },
  { value: "#9d174d", label: "Rosa" },
];

const DEFAULT_BACKGROUND_COLORS: NodeStylePopoverColorOption[] = [
  { value: "transparent", label: "Sem fundo" },
  { value: "#fca5a5", label: "Vermelho" },
  { value: "#fdba74", label: "Laranja" },
  { value: "#fde047", label: "Amarelo" },
  { value: "#86efac", label: "Verde" },
  { value: "#93c5fd", label: "Azul" },
  { value: "#a5b4fc", label: "Indigo" },
  { value: "#d8b4fe", label: "Roxo" },
  { value: "#f9a8d4", label: "Rosa" },
  { value: "#e2e8f0", label: "Neutro" },
];

interface NodeStylePopoverProps extends NodeStylePopoverStyleSlots {}

export function NodeStylePopover({
  className,
  contentClassName,
  contentStyle,
  buttonClassName,
  buttonStyle,
  toggleItemClassName,
  selectTriggerClassName,
  selectContentClassName,
  textColors,
  backgroundColors,
}: NodeStylePopoverProps = {}) {
  const textColorList = textColors ?? DEFAULT_TEXT_COLORS;
  const backgroundColorList = backgroundColors ?? DEFAULT_BACKGROUND_COLORS;
  const { customButtons } = useMindMapNodeEditorContext();
  const { zenMode, scale, offset, selectedNodeId, readOnly } = useMindMapState(
    useShallow((state) => ({
      zenMode: state.zenMode,
      scale: state.scale,
      offset: state.offset,
      selectedNodeId: state.selectedNodeId,
      readOnly: state.readOnly,
    })),
  );

  const { node: selectedNode } = useMindMapNode({ nodeId: selectedNodeId });

  if (!selectedNode || zenMode || readOnly) {
    return null;
  }

  const fontValue = (() => {
    const valueMap: Record<number, string> = {
      24: "h24",
      20: "h20",
      18: "h18",
      16: "h16",
      14: "t14",
    };
    return valueMap[selectedNode.style.fontSize] ?? "t14";
  })();

  const textAlignValue = (() => {
    const valueMap: Record<string, string> = {
      left: "start",
      center: "center",
      right: "end",
    };
    return valueMap[selectedNode.style.textAlign] ?? "start";
  })();

  return (
    <Popover open key={`${selectedNode.id}-${offset.x}-${offset.y}-${scale}`}>
      <PopoverAnchor asChild>
        <span
          className="absolute"
          style={{
            left:
              (selectedNode.pos.x +
                selectedNode.style.wrapperPadding +
                selectedNode.style.w / 2) *
                scale +
              offset.x,
            top:
              (selectedNode.pos.y + selectedNode.style.wrapperPadding) * scale +
              offset.y -
              8,
            transform: "translate(-50%, -100%)",
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        key={`${selectedNode.id}-${offset.x}-${offset.y}-${scale}-content`}
        side="top"
        align="center"
        sideOffset={10}
        className={cn(
          "w-auto border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur",
          className,
          contentClassName,
        )}
        style={contentStyle}
        data-nodex-ui
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-center gap-2">
          {customButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50",
                buttonClassName,
              )}
              style={buttonStyle}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                btn.onAction(selectedNode);
              }}
              aria-label={btn.key}
              data-nodex-ui
            >
              {btn.children}
            </button>
          ))}
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            spacing={0}
            value={fontValue}
            onValueChange={(value) => {
              if (!value) {
                return;
              }
              const fontMap: Record<string, number> = {
                h24: 24,
                h20: 20,
                h18: 18,
                h16: 16,
                t14: 14,
              };
              const nextSize = fontMap[value] ?? 16;

              selectedNode
                .chain()
                .updateFontSize(nextSize as MindMapNodeFontSize)
                .commit();
            }}
          >
            <ToggleGroupItem
              value="t14"
              aria-label="Texto"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              T
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h24"
              aria-label="H1"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H1
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h20"
              aria-label="H2"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H2
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h18"
              aria-label="H3"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H3
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h16"
              aria-label="H4"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H4
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="multiple"
            size="sm"
            variant="outline"
            spacing={0}
            value={
              [
                selectedNode.style.isBold ? "bold" : null,
                selectedNode.style.isItalic ? "italic" : null,
              ].filter(Boolean) as string[]
            }
            onValueChange={(value) => {
              const wantsBold = value.includes("bold");
              const wantsItalic = value.includes("italic");
              if (wantsBold !== selectedNode.style.isBold) {
                selectedNode.chain().toggleBold().commit();
              }

              if (wantsItalic !== selectedNode.style.isItalic) {
                selectedNode.chain().toggleItalic().commit();
              }
            }}
          >
            <ToggleGroupItem
              value="bold"
              aria-label="Negrito"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              B
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              aria-label="Italico"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              I
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            spacing={0}
            value={textAlignValue}
            onValueChange={(value) => {
              if (!value) {
                return;
              }
              const alignMap: Record<string, "left" | "center" | "right"> = {
                start: "left",
                center: "center",
                end: "right",
              };
              const nextAlign = alignMap[value] ?? "left";
              selectedNode.chain().updateTextAling(nextAlign).commit();
            }}
          >
            <ToggleGroupItem
              value="start"
              aria-label="Alinhar à esquerda"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="center"
              aria-label="Centralizar"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="end"
              aria-label="Alinhar à direita"
              className={toggleItemClassName}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <button
            type="button"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50",
              buttonClassName,
            )}
            style={buttonStyle}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (selectedNode.type === "central") {
                return;
              }
              selectedNode.chain().updateType("image").clearText().commit();
            }}
            aria-label="Transformar em imagem"
            data-nodex-ui
          >
            <Image className="h-4 w-4" />
          </button>

          <div className="flex">
            <Select
              value={selectedNode.style.textColor}
              onValueChange={(value) => {
                selectedNode.chain().updateTextColor(value).commit();
              }}
            >
              <SelectTrigger
                size="sm"
                hideIcon
                className={cn(
                  "min-h-8 min-w-8 max-w-8 max-h-8 gap-10 border-slate-200 bg-white p-0 z-50 flex overflow-hidden border-r-0 rounded-tr-none rounded-br-none",
                  selectTriggerClassName,
                )}
                style={{ color: selectedNode.style.textColor }}
                data-nodex-ui
                aria-label="Cor do texto"
              >
                <Baseline className="h-4 w-4 ml-1.5" />
                <SelectValue className="sr-only max-w-px overflow-hidden ml-100" />
              </SelectTrigger>
              <SelectContent
                align="end"
                side="bottom"
                sideOffset={6}
                className={cn("z-50 -left-3.5", selectContentClassName)}
                data-nodex-ui
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
              >
                {textColorList.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <span style={{ color: opt.value }}>
                      {opt.label ?? opt.value}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedNode.style.backgroundColor}
              onValueChange={(value) =>
                selectedNode.chain().updateBackgroundColor(value).commit()
              }
            >
              <SelectTrigger
                size="sm"
                hideIcon
                className={cn(
                  "min-h-8 min-w-8 max-w-8 max-h-8 gap-10 border-slate-200 bg-white p-0 z-50 flex overflow-hidden rounded-tl-none rounded-bl-none",
                  selectTriggerClassName,
                )}
                style={{ color: selectedNode.style.textColor }}
                data-nodex-ui
                aria-label="Cor de fundo"
              >
                <Highlighter className="h-4 w-4 ml-1.5" />
                <SelectValue className="sr-only max-w-px overflow-hidden ml-100" />
              </SelectTrigger>
              <SelectContent
                align="end"
                side="bottom"
                sideOffset={6}
                className={cn("z-50 -left-3.5", selectContentClassName)}
                data-nodex-ui
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
              >
                {backgroundColorList.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {opt.value === "transparent" ? (
                      <span className="text-slate-500">
                        {opt.label ?? "Sem fundo"}
                      </span>
                    ) : (
                      <span style={{ color: opt.value }}>
                        {opt.label ?? opt.value}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
