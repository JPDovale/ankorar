import { CreateLibraryDialog } from "@/pages/libraries/components/CreateLibraryDialog";
import { LibrariesListSection } from "@/pages/libraries/components/LibrariesListSection";
import { LibrariesPageHeader } from "@/pages/libraries/components/LibrariesPageHeader";
import { useLibrariesPage } from "@/pages/libraries/hooks/useLibrariesPage";

export function LibrariesPageContent() {
  const {
    handleCreateDialogOpenChange,
    handleCreateLibrary,
    handleOpenCreateDialog,
    isCreateDialogOpen,
    isCreatingLibrary,
    libraries,
    librariesSummaryText,
    libraryName,
    setLibraryName,
  } = useLibrariesPage();

  return (
    <section className="space-y-6">
      <LibrariesPageHeader
        librariesSummaryText={librariesSummaryText}
        onCreateLibrary={handleOpenCreateDialog}
      />

      <LibrariesListSection
        libraries={libraries}
        onCreateLibrary={handleOpenCreateDialog}
      />

      <CreateLibraryDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={handleCreateDialogOpenChange}
        libraryName={libraryName}
        onLibraryNameChange={setLibraryName}
        onCreateLibrary={handleCreateLibrary}
        isCreatingLibrary={isCreatingLibrary}
      />
    </section>
  );
}
