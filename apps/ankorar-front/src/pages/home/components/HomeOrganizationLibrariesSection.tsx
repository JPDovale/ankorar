import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHomeOrganizationLibrariesSection } from "@/pages/home/hooks/useHomeOrganizationLibrariesSection";
import { buildMapLastActivityLabel } from "@/utils/buildMapLastActivityLabel";
import { ArrowUpRight, LibraryBig, Link2 } from "lucide-react";
import { Link } from "react-router";

export function HomeOrganizationLibrariesSection() {
  const {
    activeOrganizationLibrary,
    activeOrganizationLibraryMaps,
    linkedMapsText,
    organizationLibraries,
    ownMapIds,
    setSelectedOrganizationLibraryId,
  } = useHomeOrganizationLibrariesSection();
  const hasLibraries = organizationLibraries.length > 0;

  return (
    <Card className="border-zinc-200 bg-white">
      <CardHeader className="pb-3">
        <Badge variant="secondary" className="w-fit">
          <LibraryBig className="mr-1 size-3" />
          Bibliotecas da organização
        </Badge>
        <CardTitle className="text-lg">Mapas vinculados por biblioteca</CardTitle>
        <CardDescription>
          Mapas organizados de acordo com as bibliotecas da organização atual.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!hasLibraries ? (
          <div className="rounded-xl border border-dashed border-zinc-300/80 bg-zinc-50/60 px-4 py-10">
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                <LibraryBig className="size-5 text-zinc-600" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-900">
                  Nenhuma biblioteca criada na organização
                </p>
                <p className="text-xs text-zinc-500">
                  Crie bibliotecas para separar contextos e compartilhar mapas
                  mentais com o time.
                </p>
              </div>
              <Link
                to="/libraries"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
              >
                <LibraryBig className="size-3.5" />
                Ir para bibliotecas
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <aside className="space-y-2 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-2">
              {organizationLibraries.map((library) => {
                const isActive = activeOrganizationLibrary?.id === library.id;

                return (
                  <button
                    key={library.id}
                    type="button"
                    data-active={isActive}
                    onClick={() => setSelectedOrganizationLibraryId(library.id)}
                    className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-zinc-600 transition-colors hover:border-zinc-200 hover:bg-white data-[active=true]:border-zinc-300 data-[active=true]:bg-white data-[active=true]:text-zinc-900 data-[active=true]:shadow-sm"
                  >
                    <span className="truncate text-sm font-medium">{library.name}</span>
                    <span className="ml-3 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                      {library.maps.length}
                    </span>
                  </button>
                );
              })}
            </aside>

            <section className="rounded-xl border border-zinc-200/80">
              <header className="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {activeOrganizationLibrary?.name}
                  </p>
                  <p className="text-xs text-zinc-500">{linkedMapsText}</p>
                </div>
              </header>

              {activeOrganizationLibraryMaps.length === 0 ? (
                <div className="px-4 py-8">
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-300/80 bg-zinc-50/60 px-4 py-6 text-center">
                    <span className="inline-flex size-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white shadow-sm">
                      <Link2 className="size-4 text-zinc-600" />
                    </span>
                    <p className="text-sm font-medium text-zinc-900">
                      Nenhum mapa vinculado nesta biblioteca
                    </p>
                    <p className="text-xs text-zinc-500">
                      Vincule um mapa existente para exibir o conteúdo aqui.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200/80">
                  {activeOrganizationLibraryMaps.map((map) => {
                    const canOpenFromLibrarySection = ownMapIds.has(map.id);
                    const mapOpenLabel = canOpenFromLibrarySection ? "Abrir" : "Visualizar";
                    const mapOpenLink = canOpenFromLibrarySection
                      ? `/maps/${map.id}`
                      : `/maps/${map.id}?mode=view`;
                    const mapLastActivityLabel = buildMapLastActivityLabel(map);

                    return (
                      <div
                        key={map.id}
                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-sm font-medium text-zinc-900">
                            {map.title}
                          </p>
                          <p className="text-xs text-zinc-500">{mapLastActivityLabel}</p>
                        </div>

                        <Link
                          to={mapOpenLink}
                          className="inline-flex items-center gap-1 self-start text-xs font-medium text-zinc-800 hover:underline sm:self-center"
                        >
                          {mapOpenLabel}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
