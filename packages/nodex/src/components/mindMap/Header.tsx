import type { CSSProperties } from "react";
import { useState } from "react";
import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../lib/utils";
import {
  SaveStatusIndicator,
  type MindMapSaveStatus,
} from "./SaveStatusIndicator";
import { exportMindMapAsHighQualityImage } from "../../utils/exportMindMapAsHighQualityImage";
import { exportMindMapAsMarkdown } from "../../utils/exportMindMapAsMarkdown";
import { exportMindMapAsPdf } from "../../utils/exportMindMapAsPdf";
import { Download, EllipsisVertical, FileText, LoaderCircle, FileDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

/** Slots para estilizar cada parte interna do Header (ex.: integrar com tema da aplicação) */
export interface HeaderStyleSlots {
  /** Raiz: elemento <header> */
  className?: string;
  style?: CSSProperties;
  /** Container que envolve título e ações */
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  /** Texto do título */
  titleClassName?: string;
  titleStyle?: CSSProperties;
  /** Container dos botões (menu + indicador de save) */
  actionsClassName?: string;
  actionsStyle?: CSSProperties;
  /** Botão do menu (três pontos) */
  menuTriggerClassName?: string;
  menuTriggerStyle?: CSSProperties;
  /** Conteúdo do popover (dropdown de exportar) */
  popoverContentClassName?: string;
  popoverContentStyle?: CSSProperties;
  /** Cada item do menu (Exportar imagem, MD, PDF) */
  menuItemClassName?: string;
  menuItemStyle?: CSSProperties;
  /** Indicador de status de save */
  saveStatusClassName?: string;
  saveStatusStyle?: CSSProperties;
}

export interface HeaderProps extends HeaderStyleSlots {
  title?: string;
  saveStatus?: MindMapSaveStatus | null;
  saveStatusLabels?: Partial<Record<MindMapSaveStatus, string>>;
  /** When true, shows a menu (three dots) with export and future map options. */
  showExportImageButton?: boolean;
  /** Background color for the exported PNG image (e.g. "white", "#1e293b"). */
  exportBackgroundColor?: string;
}

export function Header({
  title = "Nodex",
  className,
  style,
  wrapperClassName,
  wrapperStyle,
  titleClassName,
  titleStyle,
  actionsClassName,
  actionsStyle,
  menuTriggerClassName,
  menuTriggerStyle,
  popoverContentClassName,
  popoverContentStyle,
  menuItemClassName,
  menuItemStyle,
  saveStatus = null,
  saveStatusClassName,
  saveStatusStyle,
  saveStatusLabels,
  showExportImageButton = false,
  exportBackgroundColor,
}: HeaderProps) {
  const [exporting, setExporting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { zenMode, nodes } = useMindMapState(
    useShallow((state) => ({
      zenMode: state.zenMode,
      nodes: state.nodes,
      getFlatNodes: state.getFlatNodes,
    })),
  );

  const slug =
    (title ?? "mind-map")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || `mind-map-${Date.now()}`;

  const handleExportImage = async () => {
    if (exporting || nodes.length === 0) return;
    setExporting(true);
    try {
      await exportMindMapAsHighQualityImage(nodes, {
        filename: slug,
        exportBackgroundColor,
      });
      setMenuOpen(false);
    } finally {
      setExporting(false);
    }
  };

  const handleExportMarkdown = () => {
    if (nodes.length === 0) return;
    exportMindMapAsMarkdown(nodes, { filename: slug });
    setMenuOpen(false);
  };

  const handleExportPdf = () => {
    if (nodes.length === 0) return;
    setExporting(true);
    try {
      exportMindMapAsPdf(nodes, { filename: slug });
      setMenuOpen(false);
    } finally {
      setExporting(false);
    }
  };

  return (
    <header
      data-zen={zenMode}
      className={cn(
        "overflow-hidden border-b flex items-center w-full border-slate-200 bg-white px-4 py-3 text-base font-semibold transition-all duration-200 data-[zen=true]:pointer-events-none data-[zen=true]:max-h-0 data-[zen=true]:-translate-y-2 data-[zen=true]:opacity-0 max-h-16 translate-y-0 opacity-100",
        className,
      )}
      style={style}
    >
      <div
        className={cn("flex items-center justify-between gap-3 w-full", wrapperClassName)}
        style={wrapperStyle}
      >
        <span className={cn("truncate", titleClassName)} style={titleStyle}>
          {title}
        </span>

        <div
          className={cn("flex shrink-0 items-center gap-2", actionsClassName)}
          style={actionsStyle}
        >
          {showExportImageButton && (
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={nodes.length === 0}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50",
                    menuTriggerClassName,
                  )}
                  style={menuTriggerStyle}
                  title="Opções do mapa"
                  aria-label="Opções do mapa"
                  aria-expanded={menuOpen}
                >
                  {exporting ? (
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                      aria-hidden
                    />
                  ) : (
                    <EllipsisVertical className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className={cn("w-52 p-1", popoverContentClassName)}
                style={popoverContentStyle}
              >
                <button
                  type="button"
                  onClick={handleExportImage}
                  disabled={exporting || nodes.length === 0}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50",
                    menuItemClassName,
                  )}
                  style={menuItemStyle}
                >
                  {exporting ? (
                    <LoaderCircle
                      className="h-4 w-4 shrink-0 animate-spin"
                      aria-hidden
                    />
                  ) : (
                    <Download className="h-4 w-4 shrink-0" aria-hidden />
                  )}
                  <span>
                    {exporting ? "Exportando…" : "Exportar imagem"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  disabled={nodes.length === 0}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50",
                    menuItemClassName,
                  )}
                  style={menuItemStyle}
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Exportar em texto (MD)</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={exporting || nodes.length === 0}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50",
                    menuItemClassName,
                  )}
                  style={menuItemStyle}
                >
                  <FileDown className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Exportar PDF</span>
                </button>
              </PopoverContent>
            </Popover>
          )}
          {saveStatus ? (
            saveStatusStyle != null ? (
              <span style={saveStatusStyle}>
                <SaveStatusIndicator
                  status={saveStatus}
                  className={saveStatusClassName}
                  labels={saveStatusLabels}
                />
              </span>
            ) : (
              <SaveStatusIndicator
                status={saveStatus}
                className={saveStatusClassName}
                labels={saveStatusLabels}
              />
            )
          ) : null}
        </div>
      </div>
    </header>
  );
}
