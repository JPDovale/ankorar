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
              className="size-7 shrink-0 rounded-md text-text-muted transition-colors duration-200 hover:bg-navy-100/80 hover:text-navy-800 dark:hover:bg-navy-800/70 dark:hover:text-navy-100"
              aria-label={mapActionsAriaLabel}
            >
              <MoreHorizontal className="size-4 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={10}
            className="z-30 w-60 border-navy-200/50 bg-ds-surface-elevated p-0 shadow-[0_4px_12px_rgba(13,27,42,0.08)] dark:border-navy-700/60 dark:bg-navy-900"
          >
            <div className="border-b border-navy-200/40 bg-navy-50/80 px-3 py-2.5 dark:border-navy-700/60 dark:bg-navy-800/70">
              <p className="text-sm font-semibold text-navy-900 dark:text-ds-white">
                Ações do mapa
              </p>
              <p className="mt-0.5 truncate text-[11px] text-text-muted">
                {map.title}
              </p>
            </div>

            <div className="space-y-0.5 p-1.5">
              <Can feature="read:map">
                <Link
                  to={`/maps/${map.id}`}
                  className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-text-secondary transition-colors duration-200 hover:bg-navy-100/80 hover:text-navy-900 dark:hover:bg-navy-800/70 dark:hover:text-navy-100"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-navy-100/80 text-text-muted dark:bg-navy-800 dark:text-navy-300">
                    <PencilLine className="size-3.5" />
                  </span>
                  Editar mapa
                </Link>
              </Can>

              <Can feature="connect:library">
                <Button
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-xs font-medium text-text-secondary transition-colors duration-200 hover:bg-navy-100/80 hover:text-navy-900 dark:hover:bg-navy-800/70 dark:hover:text-navy-100"
                  onClick={() =>
                    onConnectMapRequest({ id: map.id, title: map.title })
                  }
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-navy-100/80 text-text-muted dark:bg-navy-800 dark:text-navy-300">
                    <Link2 className="size-3.5" />
                  </span>
                  Vincular biblioteca
                </Button>
              </Can>

              <Can feature="delete:map">
                <>
                  <div className="my-1 border-t border-navy-200/40 dark:border-navy-700/60" role="separator" />
                  <Button
                    variant="ghost"
                    className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-xs font-medium text-ds-danger transition-colors duration-200 hover:bg-ds-danger/10 hover:text-ds-danger"
                    onClick={() =>
                      onDeleteMapRequest({ id: map.id, title: map.title })
                    }
                    disabled={isDeletingCurrentMap}
                  >
                    {isDeletingCurrentMap ? (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-ds-danger/10">
                        <LoaderCircle className="size-3.5 animate-spin text-ds-danger" />
                      </span>
                    ) : (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-ds-danger/10 text-ds-danger">
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
