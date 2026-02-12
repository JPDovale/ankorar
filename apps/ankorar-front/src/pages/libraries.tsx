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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLibraries } from "@/hooks/useLibraries";
import { useUser } from "@/hooks/useUser";
import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { CalendarClock, LibraryBig, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const libraryPreviewThemes = [
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

export function LibrariesPage() {
  const { user } = useUser();
  const { libraries, isLoadingLibraries, createLibrary, isCreatingLibrary } =
    useLibraries();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [libraryName, setLibraryName] = useState("");

  function formatLibraryDate(inputDate: string) {
    return dayjs(inputDate).tz(SAO_PAULO_TIMEZONE).format("DD/MM HH:mm");
  }

  function buildLibraryLastActivityLabel(library: {
    created_at: string;
    updated_at: string | null;
  }) {
    const hasBeenUpdated =
      library.updated_at !== null &&
      dayjs(library.updated_at).valueOf() > dayjs(library.created_at).valueOf();

    if (hasBeenUpdated && library.updated_at) {
      return `Atualizada em ${formatLibraryDate(library.updated_at)}`;
    }

    return `Criada em ${formatLibraryDate(library.created_at)}`;
  }

  function getThemeFromLibraryId(libraryId: string) {
    const hash = libraryId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return libraryPreviewThemes[hash % libraryPreviewThemes.length];
  }

  async function handleCreateLibrary() {
    const normalizedName = libraryName.trim();

    if (!normalizedName) {
      toast.error("Informe um nome para a biblioteca.");
      return;
    }

    const { success } = await createLibrary({
      name: normalizedName,
    });

    if (!success) {
      return;
    }

    toast.success(`Biblioteca "${normalizedName}" criada com sucesso.`);
    setIsCreateDialogOpen(false);
    setLibraryName("");
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
            <LibraryBig className="mr-1 size-3" />
            Bibliotecas
          </Badge>

          <CardTitle className="text-2xl">
            Olá, {user?.name ?? "usuário"}.
          </CardTitle>

          <CardDescription className="max-w-3xl text-sm leading-relaxed">
            {isLoadingLibraries
              ? "Carregando suas bibliotecas..."
              : `Você tem ${libraries.length} biblioteca${libraries.length === 1 ? "" : "s"} na organização atual.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="min-w-56 gap-2 rounded-full"
          >
            <Plus className="size-4" />
            Criar biblioteca
          </Button>
        </CardContent>
      </Card>

      {isLoadingLibraries ? (
        <Card>
          <CardContent className="py-8 text-sm text-zinc-600">
            Carregando bibliotecas...
          </CardContent>
        </Card>
      ) : libraries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-zinc-600">
            Nenhuma biblioteca criada ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {libraries.map((library) => (
            <Card
              key={library.id}
              className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl",
                  getThemeFromLibraryId(library.id).glow,
                )}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))]"
              />

              <CardHeader className="relative p-4 pb-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "mb-2 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                    getThemeFromLibraryId(library.id).badge,
                  )}
                >
                  Biblioteca
                </Badge>

                <CardTitle className="line-clamp-2 min-h-[2.2rem] text-base leading-snug text-zinc-900">
                  {library.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative flex items-center px-4 pb-4 pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <CalendarClock className="size-3.5 shrink-0" />
                  {buildLibraryLastActivityLabel(library)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isCreatingLibrary) {
            setIsCreateDialogOpen(isOpen);
          }
        }}
      >
        <DialogContent className="max-w-sm p-5">
          <DialogHeader>
            <DialogTitle className="text-base">Criar biblioteca</DialogTitle>
          </DialogHeader>

          <Input
            value={libraryName}
            onChange={(event) => setLibraryName(event.target.value)}
            placeholder="Nome da biblioteca"
            maxLength={256}
            autoFocus
          />

          <DialogFooter>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isCreatingLibrary}
            >
              Cancelar
            </Button>
            <Button
              className="gap-2 text-xs"
              onClick={handleCreateLibrary}
              disabled={isCreatingLibrary}
            >
              {isCreatingLibrary ? (
                <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
              ) : (
                <Plus className="size-3.5 shrink-0" />
              )}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
