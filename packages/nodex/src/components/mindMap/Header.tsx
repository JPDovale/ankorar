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

interface HeaderProps {
  title?: string;
  className?: string;
  saveStatus?: MindMapSaveStatus | null;
  saveStatusClassName?: string;
  saveStatusLabels?: Partial<Record<MindMapSaveStatus, string>>;
  /** When true, shows a menu (three dots) with export and future map options. */
  showExportImageButton?: boolean;
}

export function Header({
  title = "Nodex",
  className,
  saveStatus = null,
  saveStatusClassName,
  saveStatusLabels,
  showExportImageButton = false,
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
      await exportMindMapAsHighQualityImage(nodes, { filename: slug });
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
    >
      <div className="flex items-center justify-between gap-3 w-full">
        <span className="truncate">{title}</span>

        <div className="flex shrink-0 items-center gap-2">
          {showExportImageButton && (
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={nodes.length === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
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
              <PopoverContent align="end" className="w-52 p-1">
                <button
                  type="button"
                  onClick={handleExportImage}
                  disabled={exporting || nodes.length === 0}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
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
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Exportar em texto (MD)</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={exporting || nodes.length === 0}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Exportar PDF</span>
                </button>
              </PopoverContent>
            </Popover>
          )}
          {saveStatus ? (
            <SaveStatusIndicator
              status={saveStatus}
              className={saveStatusClassName}
              labels={saveStatusLabels}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
