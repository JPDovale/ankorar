import { HomeCreateMapPopover } from "@/pages/home/components/HomeCreateMapPopover";
import { useHomePageHeader } from "@/pages/home/hooks/useHomePageHeader";

export function HomePageHeader() {
  const {
    createdTodayText,
    handleCreateMap,
    handleCreatePopoverOpenChange,
    handleMapTitleChange,
    isCreatePopoverOpen,
    isCreatingMap,
    mapTitle,
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

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <span className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
          {createdTodayText}
        </span>

        <HomeCreateMapPopover
          isOpen={isCreatePopoverOpen}
          onOpenChange={handleCreatePopoverOpenChange}
          mapTitle={mapTitle}
          onMapTitleChange={handleMapTitleChange}
          onCreateMap={handleCreateMap}
          isCreatingMap={isCreatingMap}
        />
      </div>
    </header>
  );
}
