import { Can } from "@/components/auth/Can";
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
      showLike={false}
      likesCount={map.likes_count}
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

          <PopoverContent
            align="end"
            sideOffset={10}
            className="z-30 w-60 border-zinc-200/80 p-0 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="border-b border-zinc-200/80 bg-zinc-50/80 px-3 py-2.5">
              <p className="text-sm font-semibold text-zinc-900">
                Ações do mapa
              </p>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                {map.title}
              </p>
            </div>

            <div className="space-y-0.5 p-1.5">
              <Can feature="read:map">
                <Link
                  to={`/maps/${map.id}`}
                  className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-100/80 text-zinc-500">
                    <PencilLine className="size-3.5" />
                  </span>
                  Editar mapa
                </Link>
              </Can>

              <Can feature="connect:library">
                <Button
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  onClick={() =>
                    onConnectMapRequest({ id: map.id, title: map.title })
                  }
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-100/80 text-zinc-500">
                    <Link2 className="size-3.5" />
                  </span>
                  Vincular biblioteca
                </Button>
              </Can>

              <Can feature="delete:map">
                <>
                  <div className="my-1 border-t border-zinc-200/80" role="separator" />
                  <Button
                    variant="ghost"
                    className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                      onDeleteMapRequest({ id: map.id, title: map.title })
                    }
                    disabled={isDeletingCurrentMap}
                  >
                    {isDeletingCurrentMap ? (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-red-50">
                        <LoaderCircle className="size-3.5 animate-spin text-red-600" />
                      </span>
                    ) : (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-red-50/80 text-red-500">
                        <Trash2 className="size-3.5" />
                      </span>
                    )}
                    Excluir mapa
                  </Button>
                </>
              </Can>
            </div>
          </PopoverContent>
        </Popover>
      }
    />
  );
}
