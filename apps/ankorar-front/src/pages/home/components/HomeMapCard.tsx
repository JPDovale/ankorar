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
            Mapa mental
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 shrink-0 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                aria-label={mapActionsAriaLabel}
              >
                <MoreVertical className="size-3.5 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="z-30 w-44 p-1.5">
              <Link
                to={`/maps/${map.id}`}
                className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-sm px-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                <PencilLine className="size-3.5 shrink-0" />
                Editar
              </Link>

              <Button
                variant="ghost"
                className="h-8 w-full justify-start gap-2 px-2 text-xs text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                onClick={() => onConnectMapRequest({ id: map.id, title: map.title })}
              >
                <Link2 className="size-3.5 shrink-0" />
                Vincular biblioteca
              </Button>

              <Button
                variant="ghost"
                className="h-8 w-full justify-start gap-2 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onDeleteMapRequest({ id: map.id, title: map.title })}
                disabled={isDeletingCurrentMap}
              >
                {isDeletingCurrentMap ? (
                  <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5 shrink-0" />
                )}
                Excluir
              </Button>
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
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            Abrir
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
