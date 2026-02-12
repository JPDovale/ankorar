import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMaps } from "@/hooks/useMaps";
import { useUser } from "@/hooks/useUser";
import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CalendarClock,
  LoaderCircle,
  MapPlus,
  MoreVertical,
  PencilLine,
  Shapes,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const mapPreviewThemes = [
  {
    glow: "from-cyan-400/45 via-sky-300/30 to-transparent",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  {
    glow: "from-emerald-400/45 via-teal-300/30 to-transparent",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    glow: "from-amber-400/45 via-orange-300/30 to-transparent",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    glow: "from-violet-400/45 via-indigo-300/30 to-transparent",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
] as const;

function createDateBasedMapTitle(inputDate?: string | Date) {
  const currentDateInSaoPaulo = inputDate
    ? dayjs(inputDate).tz(SAO_PAULO_TIMEZONE)
    : dayjs().tz(SAO_PAULO_TIMEZONE);

  const weekday = currentDateInSaoPaulo
    .format("ddd")
    .replace(".", "")
    .toLowerCase();

  return `${weekday} ${currentDateInSaoPaulo.format("DD/MM HH:mm")}`;
}

export function HomePage() {
  const { user } = useUser();
  const {
    maps,
    isLoadingMaps,
    createMap,
    isCreatingMap,
    deleteMap,
    isDeletingMap,
  } = useMaps();
  const [deletingMapId, setDeletingMapId] = useState<string | null>(null);
  const [mapPendingDeletion, setMapPendingDeletion] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const mapsCount = maps.length;
  const nowInSaoPaulo = dayjs().tz(SAO_PAULO_TIMEZONE);

  const createdTodayCount = maps.filter((map) =>
    dayjs(map.created_at).tz(SAO_PAULO_TIMEZONE).isSame(nowInSaoPaulo, "day"),
  ).length;

  function formatMapDate(inputDate: string) {
    return dayjs(inputDate).tz(SAO_PAULO_TIMEZONE).format("DD/MM HH:mm");
  }

  function buildMapLastActivityLabel(map: {
    created_at: string;
    updated_at: string | null;
  }) {
    const hasBeenUpdated =
      map.updated_at !== null &&
      dayjs(map.updated_at).valueOf() > dayjs(map.created_at).valueOf();

    if (hasBeenUpdated && map.updated_at) {
      return `Atualizado em ${formatMapDate(map.updated_at)}`;
    }

    return `Criado em ${formatMapDate(map.created_at)}`;
  }

  function getThemeFromMapId(mapId: string) {
    const hash = mapId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return mapPreviewThemes[hash % mapPreviewThemes.length];
  }

  async function handleCreateMap() {
    const title = createDateBasedMapTitle();

    const { success } = await createMap({
      title,
    });

    if (!success) {
      return;
    }

    toast.success(`Mapa mental "${title}" criado com sucesso.`);
  }

  function handleDeleteMapRequest(map: { id: string; title: string }) {
    setMapPendingDeletion(map);
  }

  async function handleConfirmDeleteMap() {
    if (!mapPendingDeletion) {
      return;
    }

    setDeletingMapId(mapPendingDeletion.id);

    const { success } = await deleteMap({
      id: mapPendingDeletion.id,
    });

    setDeletingMapId(null);

    if (!success) {
      return;
    }

    toast.success(`Mapa mental "${mapPendingDeletion.title}" excluído.`);
    setMapPendingDeletion(null);
  }

  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden border-zinc-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_35%)]"
        />

        <CardHeader className="relative pb-2">
          <Badge variant="secondary" className="mb-3 w-fit">
            <Shapes className="mr-1 size-3" />
            Mapas mentais
          </Badge>

          <CardTitle className="text-2xl">
            Olá, {user?.name ?? "usuário"}.
          </CardTitle>

          <CardDescription className="max-w-3xl text-sm leading-relaxed">
            {isLoadingMaps
              ? "Carregando seus mapas mentais..."
              : `Você tem ${mapsCount} mapa${mapsCount === 1 ? "" : "s"} mental${mapsCount === 1 ? "" : "is"} e criou ${createdTodayCount} hoje.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
          <Button
            onClick={handleCreateMap}
            disabled={isCreatingMap}
            className="min-w-56 gap-2 rounded-full"
          >
            {isCreatingMap ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Criando mapa mental...
              </>
            ) : (
              <>
                <MapPlus className="size-4" />
                Criar mapa mental
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoadingMaps ? (
        <Card>
          <CardContent className="py-8 text-sm text-zinc-600">
            Carregando mapas...
          </CardContent>
        </Card>
      ) : maps.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-zinc-600">
            Nenhum mapa criado ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {maps.map((map) => {
            const mapLastActivityLabel = buildMapLastActivityLabel(map);

            return (
              <Card
                key={map.id}
                className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl",
                    getThemeFromMapId(map.id).glow,
                  )}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))]"
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 z-20 size-7 text-zinc-500 hover:bg-white/70 hover:text-zinc-800"
                      aria-label={`Abrir ações do mapa mental ${map.title}`}
                    >
                      <MoreVertical className="size-3.5 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="z-30 w-44 p-1.5">
                    <Button
                      asChild
                      variant="ghost"
                      className="h-8 w-full flex-row justify-start gap-2 px-2 text-xs text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <Link
                        to={`/maps/${map.id}`}
                        className="flex w-full flex-row items-center gap-2"
                      >
                        <PencilLine className="size-3.5 shrink-0" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 w-full justify-start gap-2 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        handleDeleteMapRequest({ id: map.id, title: map.title })
                      }
                      disabled={isDeletingMap && deletingMapId === map.id}
                    >
                      {isDeletingMap && deletingMapId === map.id ? (
                        <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5 shrink-0" />
                      )}
                      Excluir
                    </Button>
                  </PopoverContent>
                </Popover>

                <CardHeader className="relative p-4 pb-2 pr-10">
                  <div className="mb-2 flex items-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        getThemeFromMapId(map.id).badge,
                      )}
                    >
                      Mapa mental
                    </Badge>
                  </div>

                  <CardTitle className="line-clamp-2 min-h-[2.2rem] text-base leading-snug text-zinc-900">
                    {map.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative flex items-center justify-between px-4 pb-4 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <CalendarClock className="size-3.5 shrink-0" />
                    {mapLastActivityLabel}
                  </span>
                  <Link
                    to={`/maps/${map.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 transition-transform group-hover:translate-x-0.5 hover:underline"
                  >
                    Abrir
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={mapPendingDeletion !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeletingMap) {
            setMapPendingDeletion(null);
          }
        }}
      >
        <DialogContent className="max-w-sm p-5">
          <DialogHeader>
            <DialogTitle className="text-base">Excluir mapa mental</DialogTitle>
            <DialogDescription className="text-sm">
              Essa ação irá mover o mapa para excluído. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => setMapPendingDeletion(null)}
              disabled={isDeletingMap}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="gap-2 text-xs"
              onClick={handleConfirmDeleteMap}
              disabled={isDeletingMap}
            >
              {isDeletingMap ? (
                <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
              ) : (
                <Trash2 className="size-3.5 shrink-0" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
