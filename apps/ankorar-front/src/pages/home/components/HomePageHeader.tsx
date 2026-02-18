import { Can } from "@/components/auth/Can";
import { HomeCreateMapPopover } from "@/pages/home/components/HomeCreateMapPopover";
import { useHomePageHeader } from "@/pages/home/hooks/useHomePageHeader";

export function HomePageHeader() {
  const {
    handleCreateMap,
    handleCreatePopoverOpenChange,
    handleMapTitleChange,
    handleMapDescriptionChange,
    handleGenerateWithAiChange,
    isCreatePopoverOpen,
    isCreatingMap,
    mapTitle,
    mapDescription,
    generateWithAi,
    mapsSummaryText,
  } = useHomePageHeader();

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Mapas mentais
        </h1>
        <p className="text-xs text-zinc-500">{mapsSummaryText}</p>
      </div>

      <div className="flex sm:items-center sm:justify-end">
        <Can feature="create:map">
          <HomeCreateMapPopover
          isOpen={isCreatePopoverOpen}
          onOpenChange={handleCreatePopoverOpenChange}
          mapTitle={mapTitle}
          mapDescription={mapDescription}
          generateWithAi={generateWithAi}
          onMapTitleChange={handleMapTitleChange}
          onMapDescriptionChange={handleMapDescriptionChange}
          onGenerateWithAiChange={handleGenerateWithAiChange}
          onCreateMap={handleCreateMap}
          isCreatingMap={isCreatingMap}
        />
        </Can>
      </div>
    </header>
  );
}
