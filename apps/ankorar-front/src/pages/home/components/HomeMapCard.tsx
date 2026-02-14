import { MapPreviewCard } from "@/components/maps/MapPreviewCard";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MapPreview } from "@/services/maps/listMapsRequest";
import {
  Link2,
  LoaderCircle,
  MoreHorizontal,
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

  return (
    <MapPreviewCard
      map={map}
      href={`/maps/${map.id}`}
      actionLabel="Abrir"
      headerAction={
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
              aria-label={mapActionsAriaLabel}
            >
              <MoreHorizontal className="size-4 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={10} className="z-30 w-56 border-zinc-200 p-1.5">
            <div className="space-y-1">
              <Link
                to={`/maps/${map.id}`}
                className="inline-flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                <PencilLine className="size-3.5 shrink-0" />
                Editar mapa
              </Link>

              <Button
                variant="ghost"
                className="h-9 w-full justify-start gap-2 rounded-md px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                onClick={() =>
                  onConnectMapRequest({ id: map.id, title: map.title })
                }
              >
                <Link2 className="size-3.5 shrink-0" />
                Vincular biblioteca
              </Button>

              <Button
                variant="ghost"
                className="h-9 w-full justify-start gap-2 rounded-md px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() =>
                  onDeleteMapRequest({ id: map.id, title: map.title })
                }
                disabled={isDeletingCurrentMap}
              >
                {isDeletingCurrentMap && (
                  <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
                )}
                {!isDeletingCurrentMap && (
                  <Trash2 className="size-3.5 shrink-0" />
                )}
                Excluir mapa
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      }
    />
  );
}
