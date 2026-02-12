import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMaps } from "@/hooks/useMaps";
import { useUser } from "@/hooks/useUser";
import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CalendarClock,
  LoaderCircle,
  MapPlus,
  Shapes,
} from "lucide-react";
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
  const { maps, isLoadingMaps, createMap, isCreatingMap } = useMaps();
  const mapsCount = maps.length;
  const nowInSaoPaulo = dayjs().tz(SAO_PAULO_TIMEZONE);

  const createdTodayCount = maps.filter((map) =>
    dayjs(map.created_at).tz(SAO_PAULO_TIMEZONE).isSame(nowInSaoPaulo, "day"),
  ).length;

  function formatCreatedAtLabel(createdAt: string) {
    return dayjs(createdAt).tz(SAO_PAULO_TIMEZONE).format("DD/MM HH:mm");
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
            const updateLabel = map.updated_at
              ? `Atualizado ${formatCreatedAtLabel(map.updated_at)}`
              : `Criado ${formatCreatedAtLabel(map.created_at)}`;

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

                <CardHeader className="relative p-4 pb-2">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        getThemeFromMapId(map.id).badge,
                      )}
                    >
                      Mapa mental
                    </Badge>
                    <span className="rounded-full border border-zinc-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                      {formatCreatedAtLabel(map.created_at)}
                    </span>
                  </div>

                  <CardTitle className="line-clamp-2 min-h-[2.2rem] text-base leading-snug text-zinc-900">
                    {map.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative flex items-center justify-between px-4 pb-4 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <CalendarClock className="size-3" />
                    {updateLabel}
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
    </section>
  );
}
