import { LibraryMapsMosaic } from "@/components/libraries/LibraryMapsMosaic";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { LibraryPreview } from "@/services/libraries/listLibrariesRequest";
import { buildLibraryLastActivityLabel } from "@/utils/buildLibraryLastActivityLabel";
import {
  CalendarClock,
  ChevronRight,
  MoreVertical,
  PencilLine,
} from "lucide-react";

interface LibraryCardProps {
  library: LibraryPreview;
  ownMapIds?: Set<string>;
}

export function LibraryCard({ library, ownMapIds }: LibraryCardProps) {
  const libraryLastActivityLabel = buildLibraryLastActivityLabel(library);
  const cardActionsLabel = `Abrir ações da biblioteca ${library.name}`;
  const linkedMaps = library.maps ?? [];
  const linkedMapsSummaryText = `${linkedMaps.length} mapa${linkedMaps.length === 1 ? "" : "s"}`;

  return (
    <article className="space-y-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-3 transition-colors hover:border-zinc-300/80">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-semibold text-zinc-900">{library.name}</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
            <CalendarClock className="size-3.5 shrink-0" />
            {libraryLastActivityLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
            {linkedMapsSummaryText}
          </span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-xs hover:bg-zinc-50 hover:text-zinc-800"
                aria-label={cardActionsLabel}
              >
                <MoreVertical className="size-3.5 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={10} className="z-30 w-60 border-zinc-200 p-0">
              <div className="border-b border-zinc-200 bg-zinc-50/70 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {library.name}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Ações da biblioteca
                </p>
              </div>

              <div className="space-y-1 p-1.5">
                <Button
                  variant="ghost"
                  className="h-9 w-full justify-between gap-2 rounded-lg px-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-500"
                  disabled
                >
                  <span className="inline-flex items-center gap-2">
                    <PencilLine className="size-3.5 shrink-0" />
                    Renomear (em breve)
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 opacity-70" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <LibraryMapsMosaic
        maps={linkedMaps}
        emptyText="Nenhum mapa vinculado nesta biblioteca."
        getMapActionLabel={() => "Visualizar"}
        getMapHref={(map) => `/maps/${map.id}?mode=view`}
        getCanShowLike={
          ownMapIds ? (map) => !ownMapIds.has(map.id) : undefined
        }
        variant="embedded"
      />
    </article>
  );
}
