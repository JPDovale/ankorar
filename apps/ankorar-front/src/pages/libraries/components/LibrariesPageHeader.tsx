import { Can } from "@/components/auth/Can";
import { CreateLibraryPopover } from "@/pages/libraries/components/CreateLibraryPopover";

interface LibrariesPageHeaderProps {
  isCreatePopoverOpen: boolean;
  isCreatingLibrary: boolean;
  libraryName: string;
  librariesSummaryText: string;
  onCreateLibrary: () => void;
  onCreatePopoverOpenChange: (isOpen: boolean) => void;
  onLibraryNameChange: (name: string) => void;
}

export function LibrariesPageHeader({
  isCreatePopoverOpen,
  isCreatingLibrary,
  libraryName,
  librariesSummaryText,
  onCreateLibrary,
  onCreatePopoverOpenChange,
  onLibraryNameChange,
}: LibrariesPageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Bibliotecas
        </h1>
        <p className="text-xs text-zinc-500">{librariesSummaryText}</p>
      </div>

      <Can feature="create:library">
        <CreateLibraryPopover
          isOpen={isCreatePopoverOpen}
          onOpenChange={onCreatePopoverOpenChange}
          libraryName={libraryName}
          onLibraryNameChange={onLibraryNameChange}
          onCreateLibrary={onCreateLibrary}
          isCreatingLibrary={isCreatingLibrary}
        />
      </Can>
    </header>
  );
}
