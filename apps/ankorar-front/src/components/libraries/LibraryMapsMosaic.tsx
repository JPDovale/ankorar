import type { LibraryMapPreview } from "@/services/libraries/listLibrariesRequest";
import { buildMapLastActivityLabel } from "@/utils/buildMapLastActivityLabel";
import { ArrowUpRight, CalendarClock, Link2, Map } from "lucide-react";
import { Link } from "react-router";

interface LibraryMapsMosaicProps {
  maps: LibraryMapPreview[];
  emptyText: string;
  getMapHref: (map: LibraryMapPreview) => string;
  getMapActionLabel: (map: LibraryMapPreview) => string;
}

export function LibraryMapsMosaic({
  maps,
  emptyText,
  getMapHref,
  getMapActionLabel,
}: LibraryMapsMosaicProps) {
  const hasMaps = maps.length > 0;

  return (
    <>
      {!hasMaps && (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-200/80 bg-zinc-50/60 px-3 py-2 text-xs text-zinc-500">
          <Link2 className="size-3.5" />
          {emptyText}
        </div>
      )}

      {hasMaps && (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {maps.map((map) => {
            const mapLastActivityLabel = buildMapLastActivityLabel(map);
            const mapLink = getMapHref(map);
            const mapActionLabel = getMapActionLabel(map);

            return (
              <article
                key={map.id}
                className="group rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-colors hover:border-zinc-300/80"
              >
                <header className="space-y-3 p-3 pb-2.5">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {map.title}
                  </p>

                  <div className="flex items-center justify-center py-2">
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                      <Map className="size-6" />
                    </span>
                  </div>
                </header>

                <div className="px-3 pb-3 pt-0">
                  <div className="flex items-center justify-between gap-2 border-t border-zinc-100 pt-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <CalendarClock className="size-3.5 shrink-0" />
                      {mapLastActivityLabel}
                    </span>
                    <Link
                      to={mapLink}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
                    >
                      {mapActionLabel}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
