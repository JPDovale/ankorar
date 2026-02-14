import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MapPreview } from "@/services/maps/listMapsRequest";
import { buildMapLastActivityLabel } from "@/utils/buildMapLastActivityLabel";
import {
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
  Link2,
  LoaderCircle,
  Map,
  MoreVertical,
  PencilLine,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

interface HomeMapCardProps {
  map: MapPreview;
  isDeletingMap: boolean;
  deletingMapId: string | null;
  onDeleteMapRequest: (map: { id: string; title: string }) => void;
  onConnectMapRequest: (map: { id: string; title: string }) => void;
}

export function HomeMapCard({
  map,
  isDeletingMap,
  deletingMapId,
  onDeleteMapRequest,
  onConnectMapRequest,
}: HomeMapCardProps) {
  const isDeletingCurrentMap = isDeletingMap && deletingMapId === map.id;
  const mapActionsAriaLabel = `Abrir ações do mapa mental ${map.title}`;
  const mapLastActivityLabel = buildMapLastActivityLabel(map);

  return (
    <article className="group rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-colors hover:border-zinc-300/80">
      <header className="space-y-3 p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {map.title}
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-xs hover:bg-zinc-50 hover:text-zinc-800"
                aria-label={mapActionsAriaLabel}
              >
                <MoreVertical className="size-3.5 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="z-30 w-60 border-zinc-200 p-0"
            >
              <div className="border-b border-zinc-200 bg-zinc-50/70 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {map.title}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Ações de edição do mapa
                </p>
              </div>

              <div className="space-y-1 p-1.5">
                <Link
                  to={`/maps/${map.id}`}
                  className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <span className="inline-flex items-center gap-2">
                    <PencilLine className="size-3.5 shrink-0" />
                    Editar mapa
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 opacity-70" />
                </Link>

                <Button
                  variant="ghost"
                  className="h-9 w-full justify-between gap-2 rounded-lg px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  onClick={() =>
                    onConnectMapRequest({ id: map.id, title: map.title })
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <Link2 className="size-3.5 shrink-0" />
                    Vincular biblioteca
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 opacity-70" />
                </Button>

                <Button
                  variant="ghost"
                  className="h-9 w-full justify-between gap-2 rounded-lg px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() =>
                    onDeleteMapRequest({ id: map.id, title: map.title })
                  }
                  disabled={isDeletingCurrentMap}
                >
                  <span className="inline-flex items-center gap-2">
                    {isDeletingCurrentMap && (
                      <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
                    )}
                    {!isDeletingCurrentMap && (
                      <Trash2 className="size-3.5 shrink-0" />
                    )}
                    Excluir mapa
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 opacity-70" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center justify-center py-2">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
            <Map className="size-7" />
          </span>
        </div>
      </header>

      <div className="px-4 pb-4 pt-0">
        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
            <CalendarClock className="size-3.5 shrink-0" />
            {mapLastActivityLabel}
          </span>
          <Link
            to={`/maps/${map.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            Abrir
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
