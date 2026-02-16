import { LibraryMapsMosaic } from "@/components/libraries/LibraryMapsMosaic";
import { Badge } from "@/components/ui/badge";
import { useHomeOrganizationLibrariesSection } from "@/pages/home/hooks/useHomeOrganizationLibrariesSection";
import { LibraryBig } from "lucide-react";
import { Link } from "react-router";

export function HomeOrganizationLibrariesSection() {
  const {
    linkedMapsText,
    organizationLibrariesText,
    organizationLibraries,
    ownMapIds,
  } = useHomeOrganizationLibrariesSection();
  const hasLibraries = organizationLibraries.length > 0;

  return (
    <section className="space-y-3">
      <header className="space-y-1">
        <Badge variant="secondary" className="w-fit">
          <LibraryBig className="mr-1 size-3" />
          Bibliotecas da organização
        </Badge>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          Mapas vinculados por biblioteca
        </h2>
        <p className="text-xs text-zinc-500">
          Mapas organizados de acordo com as bibliotecas da organização atual.
        </p>
      </header>

      {!hasLibraries && (
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
              className="inline-flex h-9 min-w-56 items-center justify-center gap-2 rounded-lg bg-violet-400 px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)] transition-colors hover:bg-violet-500"
            >
              <LibraryBig className="size-4" />
              Ir para bibliotecas
            </Link>
          </div>
        </div>
      )}

      {hasLibraries && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">
            {organizationLibrariesText} • {linkedMapsText}
          </p>

          <div className="space-y-3">
            {organizationLibraries.map((library) => {
              const libraryLinkedMapsCount = library.maps.length;
              const libraryLinkedMapsText = `${libraryLinkedMapsCount} mapa${libraryLinkedMapsCount === 1 ? "" : "s"} vinculados`;

              return (
                <article
                  key={library.id}
                  className="space-y-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-3 transition-colors hover:border-zinc-300/80"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {library.name}
                    </p>
                    <span className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                      {libraryLinkedMapsText}
                    </span>
                  </div>

                  <LibraryMapsMosaic
                    maps={library.maps}
                    emptyText="Nenhum mapa vinculado nesta biblioteca."
                    getMapActionLabel={(map) =>
                      ownMapIds.has(map.id) ? "Abrir" : "Visualizar"
                    }
                    getMapHref={(map) =>
                      ownMapIds.has(map.id)
                        ? `/maps/${map.id}`
                        : `/maps/${map.id}?mode=view`
                    }
                    variant="embedded"
                  />
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
