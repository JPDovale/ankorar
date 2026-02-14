import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LibraryCard } from "@/pages/libraries/components/LibraryCard";
import type { LibraryPreview } from "@/services/libraries/listLibrariesRequest";
import { LibraryBig, Plus } from "lucide-react";

interface LibrariesListSectionProps {
  libraries: LibraryPreview[];
  onCreateLibrary: () => void;
}

export function LibrariesListSection({
  libraries,
  onCreateLibrary,
}: LibrariesListSectionProps) {
  const isEmptyState = libraries.length === 0;

  return (
    <>
      {isEmptyState && (
        <Card className="border-dashed border-zinc-300/80 bg-zinc-50/50">
          <CardContent className="flex flex-col items-center gap-4 px-4 py-12 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <LibraryBig className="size-5 text-zinc-600" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                Nenhuma biblioteca criada ainda
              </p>
              <p className="text-xs text-zinc-500">
                Crie bibliotecas para estruturar os mapas da organização.
              </p>
            </div>
            <Button onClick={onCreateLibrary} className="gap-2 rounded-full px-5">
              <Plus className="size-4" />
              Criar biblioteca
            </Button>
          </CardContent>
        </Card>
      )}

      {!isEmptyState && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {libraries.map((library) => (
            <LibraryCard key={library.id} library={library} />
          ))}
        </div>
      )}
    </>
  );
}
