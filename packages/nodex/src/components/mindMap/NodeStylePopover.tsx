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
import { cn } from "../../lib/utils";

interface NodeStylePopoverProps {
  className?: string;
}

export function NodeStylePopover({ className }: NodeStylePopoverProps = {}) {
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

  if (!selectedNode || zenMode || selectedNode.type === "central" || readOnly) {
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
        )}
        data-nodex-ui
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-center gap-2">
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
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              T
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h24"
              aria-label="H1"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H1
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h20"
              aria-label="H2"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H2
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h18"
              aria-label="H3"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              H3
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h16"
              aria-label="H4"
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
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              B
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              aria-label="Italico"
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
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="center"
              aria-label="Centralizar"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="end"
              aria-label="Alinhar à direita"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
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
                className="min-h-8 min-w-8 max-w-8 max-h-8 gap-10 border-slate-200 bg-white p-0 z-50 flex overflow-hidden border-r-0 rounded-tr-none rounded-br-none"
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
                className="z-50 -left-3.5"
                data-nodex-ui
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
              >
                <SelectItem
                  value="#0f172a"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#0f172a" }}>Preto</span>
                </SelectItem>
                <SelectItem
                  value="#1f2937"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#1f2937" }}>Cinza</span>
                </SelectItem>
                <SelectItem
                  value="#991b1b"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#991b1b" }}>Vermelho</span>
                </SelectItem>
                <SelectItem
                  value="#9a3412"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#9a3412" }}>Laranja</span>
                </SelectItem>
                <SelectItem
                  value="#a16207"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#a16207" }}>Amarelo</span>
                </SelectItem>
                <SelectItem
                  value="#166534"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#166534" }}>Verde</span>
                </SelectItem>
                <SelectItem
                  value="#1e40af"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#1e40af" }}>Azul</span>
                </SelectItem>
                <SelectItem
                  value="#3730a3"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#3730a3" }}>Indigo</span>
                </SelectItem>
                <SelectItem
                  value="#6b21a8"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#6b21a8" }}>Roxo</span>
                </SelectItem>
                <SelectItem
                  value="#9d174d"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#9d174d" }}>Rosa</span>
                </SelectItem>
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
                className="min-h-8 min-w-8 max-w-8 max-h-8 gap-10 border-slate-200 bg-white p-0 z-50 flex overflow-hidden rounded-tl-none rounded-bl-none"
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
                className="z-50 -left-3.5"
                data-nodex-ui
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
              >
                <SelectItem
                  value="transparent"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span className="text-slate-500">Sem fundo</span>
                </SelectItem>
                <SelectItem
                  value="#fca5a5"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#991b1b" }}>Vermelho</span>
                </SelectItem>
                <SelectItem
                  value="#fdba74"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#9a3412" }}>Laranja</span>
                </SelectItem>
                <SelectItem
                  value="#fde047"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#a16207" }}>Amarelo</span>
                </SelectItem>
                <SelectItem
                  value="#86efac"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#166534" }}>Verde</span>
                </SelectItem>
                <SelectItem
                  value="#93c5fd"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#1e40af" }}>Azul</span>
                </SelectItem>
                <SelectItem
                  value="#a5b4fc"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#3730a3" }}>Indigo</span>
                </SelectItem>
                <SelectItem
                  value="#d8b4fe"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#6b21a8" }}>Roxo</span>
                </SelectItem>
                <SelectItem
                  value="#f9a8d4"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#9d174d" }}>Rosa</span>
                </SelectItem>
                <SelectItem
                  value="#e2e8f0"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <span style={{ color: "#1f2937" }}>Neutro</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
