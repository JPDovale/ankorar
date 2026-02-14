import { Button } from "@/components/ui/button";
import { useHomePageHeader } from "@/pages/home/hooks/useHomePageHeader";
import { LoaderCircle, MapPlus } from "lucide-react";

export function HomePageHeader() {
  const {
    createdTodayText,
    createButtonText,
    handleCreateMap,
    isCreatingMap,
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
        <span className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
          {createdTodayText}
        </span>

        <Button
          onClick={handleCreateMap}
          disabled={isCreatingMap}
          className="min-w-56 gap-2 rounded-full"
        >
          {isCreatingMap ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <MapPlus className="size-4" />
          )}
          {createButtonText}
        </Button>
      </div>
    </header>
  );
}
