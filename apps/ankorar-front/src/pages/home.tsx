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
import { cn } from "@/lib/utils";
import { ArrowUpRight, CalendarClock, LoaderCircle, MapPlus, Shapes } from "lucide-react";
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

function createDateBasedMapTitle(date = new Date()) {
  const weekday = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
  })
    .format(date)
    .replace(".", "")
    .toLowerCase();

  const dayAndMonth = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

  const hourAndMinute = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${weekday} ${dayAndMonth} ${hourAndMinute}`;
}

export function HomePage() {
  const { user } = useUser();
  const { maps, isLoadingMaps, createMap, isCreatingMap } = useMaps();

  function formatCreatedAtLabel(createdAt: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(createdAt));
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

    toast.success(`Mapa "${title}" criado com sucesso.`);
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
            Mapas
          </Badge>

          <CardTitle className="text-2xl">
            Olá, {user?.name ?? "usuário"}. Seus mapas começam aqui.
          </CardTitle>

          <CardDescription className="max-w-3xl text-sm leading-relaxed">
            Crie um novo mapa com um clique. O título é gerado automaticamente
            com dia e horário atual.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
          <Button
            onClick={handleCreateMap}
            disabled={isCreatingMap}
            className="min-w-56 gap-2"
          >
            {isCreatingMap ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Criando mapa...
              </>
            ) : (
              <>
                <MapPlus className="size-4" />
                Criar novo mapa
              </>
            )}
          </Button>

          <p className="text-sm text-zinc-600">
            Exemplo de título:{" "}
            <span className="font-medium">qui 12/02 15:34</span>
          </p>
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
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {maps.map((map) => (
            <Card
              key={map.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-gradient-to-br blur-3xl",
                  getThemeFromMapId(map.id).glow,
                )}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))]"
              />

              <CardHeader className="relative pb-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
                      getThemeFromMapId(map.id).badge,
                    )}
                  >
                    Mapa
                  </Badge>
                  <span className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600">
                    {formatCreatedAtLabel(map.created_at)}
                  </span>
                </div>

                <CardTitle className="line-clamp-2 text-xl leading-tight text-zinc-900">
                  {map.title}
                </CardTitle>

                <CardDescription className="pt-1 text-sm text-zinc-600">
                  Preview do mapa
                </CardDescription>
              </CardHeader>

              <CardContent className="relative flex items-center justify-between pt-0">
                <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
                  <CalendarClock className="size-3.5" />
                  Atualizado{" "}
                  {map.updated_at
                    ? formatCreatedAtLabel(map.updated_at)
                    : "agora"}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-800 transition-transform group-hover:translate-x-1">
                  Abrir
                  <ArrowUpRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
