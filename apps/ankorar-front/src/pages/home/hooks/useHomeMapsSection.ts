import { HomePendingAiMapContext } from "@/pages/home/context/HomePendingAiMapContext";
import { useSuspenseLibraries } from "@/hooks/useLibraries";
import { useMaps, useSuspenseMaps } from "@/hooks/useMaps";
import { createDateBasedMapTitle } from "@/utils/createDateBasedMapTitle";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export function useHomeMapsSection() {
  const pendingAiMapContext = useContext(HomePendingAiMapContext);
  const { data: maps } = useSuspenseMaps();
  const { data: libraries } = useSuspenseLibraries();
  const {
    createMap,
    isCreatingMap,
    deleteMap,
    connectMapToLibrary,
    isDeletingMap,
    isConnectingMapToLibrary,
  } = useMaps();
  const [deletingMapId, setDeletingMapId] = useState<string | null>(null);
  const [mapPendingDeletion, setMapPendingDeletion] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [mapPendingLibraryConnection, setMapPendingLibraryConnection] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedLibraryId, setSelectedLibraryId] = useState("");

  const pending = pendingAiMapContext?.pending ?? null;

  useEffect(() => {
    if (
      pending?.status === "finished" &&
      maps.some((m) => m.id === pending.mapId)
    ) {
      pendingAiMapContext?.setPending(null);
    }
  }, [maps, pending, pendingAiMapContext]);

  async function handleCreateMap() {
    const title = createDateBasedMapTitle();
    const { success } = await createMap({
      title,
    });

    if (!success) {
      return;
    }

    toast.success(`Mapa mental "${title}" criado com sucesso.`);
  }

  function handleDeleteMapRequest(map: { id: string; title: string }) {
    setMapPendingDeletion(map);
  }

  function handleConnectMapRequest(map: { id: string; title: string }) {
    if (libraries.length === 0) {
      toast.error("Crie uma biblioteca antes de vincular um mapa.");
      return;
    }

    setSelectedLibraryId(libraries[0]?.id ?? "");
    setMapPendingLibraryConnection(map);
  }

  function handleCloseDeleteDialog() {
    if (isDeletingMap) {
      return;
    }

    setMapPendingDeletion(null);
  }

  function handleCloseConnectDialog() {
    if (isConnectingMapToLibrary) {
      return;
    }

    setMapPendingLibraryConnection(null);
    setSelectedLibraryId("");
  }

  async function handleConfirmDeleteMap() {
    if (!mapPendingDeletion) {
      return;
    }

    setDeletingMapId(mapPendingDeletion.id);

    const { success } = await deleteMap({
      id: mapPendingDeletion.id,
    });

    setDeletingMapId(null);

    if (!success) {
      return;
    }

    toast.success(`Mapa mental "${mapPendingDeletion.title}" excluído.`);
    setMapPendingDeletion(null);
  }

  async function handleConfirmConnectMapToLibrary() {
    if (!mapPendingLibraryConnection || !selectedLibraryId) {
      return;
    }

    const library = libraries.find((item) => item.id === selectedLibraryId);

    const { success } = await connectMapToLibrary({
      mapId: mapPendingLibraryConnection.id,
      libraryId: selectedLibraryId,
    });

    if (!success) {
      return;
    }

    toast.success(
      `Mapa mental "${mapPendingLibraryConnection.title}" vinculado à biblioteca "${library?.name ?? "selecionada"}".`,
    );

    setMapPendingLibraryConnection(null);
    setSelectedLibraryId("");
  }

  return {
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
    pendingAiMap: pending,
    selectedLibraryId,
    setSelectedLibraryId,
  };
}
