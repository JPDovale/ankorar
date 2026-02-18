import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { LibrariesListSection } from "@/pages/libraries/components/LibrariesListSection";
import { LibrariesPageHeader } from "@/pages/libraries/components/LibrariesPageHeader";
import { useLibrariesPage } from "@/pages/libraries/hooks/useLibrariesPage";
import { LibraryBig } from "lucide-react";

export function LibrariesPageContent() {
  const { can } = useUser();
  const {
    handleCreateLibrary,
    handleCreatePopoverOpenChange,
    handleLibraryNameChange,
    isCreatePopoverOpen,
    isCreatingLibrary,
    libraries,
    librariesSummaryText,
    libraryName,
    ownMapIds,
  } = useLibrariesPage();

  if (!can("read:library")) {
    return (
      <Card className="border-dashed border-zinc-300/80 bg-zinc-50/50">
        <CardContent className="flex flex-col items-center gap-4 px-4 py-12 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <LibraryBig className="size-5 text-zinc-600" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-900">
              Sem permissão para bibliotecas
            </p>
            <p className="text-xs text-zinc-500">
              Você não tem permissão para ver bibliotecas nesta organização.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <LibrariesPageHeader
        isCreatePopoverOpen={isCreatePopoverOpen}
        onCreatePopoverOpenChange={handleCreatePopoverOpenChange}
        libraryName={libraryName}
        onLibraryNameChange={handleLibraryNameChange}
        isCreatingLibrary={isCreatingLibrary}
        librariesSummaryText={librariesSummaryText}
        onCreateLibrary={handleCreateLibrary}
      />

      <LibrariesListSection
        libraries={libraries}
        onCreateLibrary={() => handleCreatePopoverOpenChange(true)}
        ownMapIds={ownMapIds}
      />
    </section>
  );
}
