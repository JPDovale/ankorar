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
  LibraryBig,
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
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-200/60 transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:ring-zinc-200/80">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-200/50">
              <LibraryBig className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {library.name}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                <CalendarClock className="size-3 shrink-0" aria-hidden />
                {libraryLastActivityLabel}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-lg bg-zinc-100/80 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-zinc-600 ring-1 ring-zinc-200/50">
              {linkedMapsSummaryText}
            </span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  aria-label={cardActionsLabel}
                >
                  <MoreVertical className="size-3.5 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={10}
                className="z-30 w-60 border-zinc-200/80 p-0 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              >
                <div className="border-b border-zinc-200/80 bg-zinc-50/80 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {library.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    Ações da biblioteca
                  </p>
                </div>

                <div className="space-y-0.5 p-1.5">
                  <Button
                    variant="ghost"
                    className="h-9 w-full justify-between gap-2 rounded-lg px-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
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
      </div>

      <div className="border-t border-zinc-200/60 bg-zinc-50/40 px-4 pb-4 pt-3">
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
      </div>
    </article>
  );
}
