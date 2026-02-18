import { CreationActionButton } from "@/components/actions/CreationActionButton";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { HomeConnectMapToLibraryDialog } from "@/pages/home/components/HomeConnectMapToLibraryDialog";
import { HomeDeleteMapDialog } from "@/pages/home/components/HomeDeleteMapDialog";
import { HomeMapCard } from "@/pages/home/components/HomeMapCard";
import { HomePendingAiMapCard } from "@/pages/home/components/HomePendingAiMapCard";
import { useHomeMapsSection } from "@/pages/home/hooks/useHomeMapsSection";
import { MapPlus } from "lucide-react";

export function HomeMapsSection() {
  const { can } = useUser();
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
    pendingAiMap,
    selectedLibraryId,
    setSelectedLibraryId,
  } = useHomeMapsSection();
  const isEmptyState = maps.length === 0 && !pendingAiMap;
  const canCreateMap = can("create:map");

  return (
    <>
      {isEmptyState && (
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
                {canCreateMap
                  ? "Crie seu primeiro mapa mental para começar a organizar ideias."
                  : "Você não tem permissão para criar mapas nesta organização."}
              </p>
            </div>
            {canCreateMap && (
              <CreationActionButton
                icon={MapPlus}
                label="Criar mapa mental"
                loading={isCreatingMap}
                loadingLabel="Criando mapa..."
                onClick={handleCreateMap}
                disabled={isCreatingMap}
                className="h-9 min-w-56 px-5"
              />
            )}
          </CardContent>
        </Card>
      )}

      {!isEmptyState && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pendingAiMap && (
            <HomePendingAiMapCard key="pending-ai" pending={pendingAiMap} />
          )}
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
