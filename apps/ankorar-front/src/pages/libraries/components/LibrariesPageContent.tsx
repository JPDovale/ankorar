import { LibrariesListSection } from "@/pages/libraries/components/LibrariesListSection";
import { LibrariesPageHeader } from "@/pages/libraries/components/LibrariesPageHeader";
import { useLibrariesPage } from "@/pages/libraries/hooks/useLibrariesPage";

export function LibrariesPageContent() {
  const {
    handleCreateLibrary,
    handleCreatePopoverOpenChange,
    handleLibraryNameChange,
    isCreatePopoverOpen,
    isCreatingLibrary,
    libraries,
    librariesSummaryText,
    libraryName,
  } = useLibrariesPage();

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
      />
    </section>
  );
}
