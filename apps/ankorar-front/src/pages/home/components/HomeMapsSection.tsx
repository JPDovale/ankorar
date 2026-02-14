import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeConnectMapToLibraryDialog } from "@/pages/home/components/HomeConnectMapToLibraryDialog";
import { HomeDeleteMapDialog } from "@/pages/home/components/HomeDeleteMapDialog";
import { HomeMapCard } from "@/pages/home/components/HomeMapCard";
import { useHomeMapsSection } from "@/pages/home/hooks/useHomeMapsSection";
import { LoaderCircle, MapPlus } from "lucide-react";

export function HomeMapsSection() {
  const {
    deletingMapId,
    handleCloseConnectDialog,
    handleCloseDeleteDialog,
    handleConfirmConnectMapToLibrary,
    handleConfirmDeleteMap,
    handleConnectMapRequest,
    handleCreateMap,
    handleDeleteMapRequest,
    isConnectingMapToLibrary,
    isCreatingMap,
    isDeletingMap,
    libraries,
    mapPendingDeletion,
    mapPendingLibraryConnection,
    maps,
    selectedLibraryId,
    setSelectedLibraryId,
  } = useHomeMapsSection();
  const emptyStateButtonLabel = isCreatingMap ? "Criando..." : "Criar mapa mental";
  const isEmptyState = maps.length === 0;

  return (
    <>
      {isEmptyState ? (
        <Card className="border-dashed border-zinc-300/80 bg-zinc-50/50">
          <CardContent className="flex flex-col items-center gap-4 px-4 py-12 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <MapPlus className="size-5 text-zinc-600" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                Nenhum mapa criado ainda
              </p>
              <p className="text-xs text-zinc-500">
                Crie seu primeiro mapa mental para começar a organizar ideias.
              </p>
            </div>
            <Button
              onClick={handleCreateMap}
              disabled={isCreatingMap}
              className="gap-2 rounded-full px-5"
            >
              {isCreatingMap ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <MapPlus className="size-4" />
              )}
              {emptyStateButtonLabel}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {maps.map((map) => (
            <HomeMapCard
              key={map.id}
              map={map}
              isDeletingMap={isDeletingMap}
              deletingMapId={deletingMapId}
              onDeleteMapRequest={handleDeleteMapRequest}
              onConnectMapRequest={handleConnectMapRequest}
            />
          ))}
        </div>
      )}

      <HomeDeleteMapDialog
        mapPendingDeletion={mapPendingDeletion}
        isDeletingMap={isDeletingMap}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteMap}
      />

      <HomeConnectMapToLibraryDialog
        libraries={libraries}
        mapPendingLibraryConnection={mapPendingLibraryConnection}
        selectedLibraryId={selectedLibraryId}
        onSelectedLibraryIdChange={setSelectedLibraryId}
        isConnectingMapToLibrary={isConnectingMapToLibrary}
        onClose={handleCloseConnectDialog}
        onConfirm={handleConfirmConnectMapToLibrary}
      />
    </>
  );
}
