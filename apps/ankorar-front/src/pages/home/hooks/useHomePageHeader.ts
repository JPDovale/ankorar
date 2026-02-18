import { HomePendingAiMapContext } from "@/pages/home/context/HomePendingAiMapContext";
import { useMaps, useSuspenseMaps } from "@/hooks/useMaps";
import { createDateBasedMapTitle } from "@/utils/createDateBasedMapTitle";
import { useContext, useState } from "react";
import { toast } from "sonner";

export function useHomePageHeader() {
  const pendingAiMapContext = useContext(HomePendingAiMapContext);
  const { data: maps } = useSuspenseMaps();
  const { createMap, createMapFromAi, isCreatingMap, isCreatingMapFromAi } =
    useMaps();
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);
  const [mapTitle, setMapTitle] = useState(() => createDateBasedMapTitle());
  const [generateWithAi, setGenerateWithAi] = useState(false);
  const [mapDescription, setMapDescription] = useState("");

  const mapsCount = maps.length;
  const mapsSummaryText = `Você tem ${mapsCount} mapa${mapsCount === 1 ? "" : "s"} mental${mapsCount === 1 ? "" : "is"} na organização atual.`;

  const isCreating = isCreatingMap || isCreatingMapFromAi;

  function handleCreatePopoverOpenChange(isOpen: boolean) {
    if (isCreating) {
      return;
    }

    setIsCreatePopoverOpen(isOpen);
  }

  function handleMapTitleChange(nextTitle: string) {
    setMapTitle(nextTitle);
  }

  function handleGenerateWithAiChange(next: boolean) {
    setGenerateWithAi(next);
    if (!next) {
      setMapDescription("");
    }
  }

  function handleMapDescriptionChange(next: string) {
    setMapDescription(next);
  }

  async function handleCreateMap() {
    if (generateWithAi) {
      const description = mapDescription.trim();
      if (!description) {
        toast.error("Descreva o conteúdo que deseja no mapa mental.");
        return;
      }

      const displayTitle =
        mapTitle.trim().length > 0 ? mapTitle.trim() : description.slice(0, 60);

      pendingAiMapContext?.setPending({
        status: "loading",
        title: displayTitle,
      });
      setIsCreatePopoverOpen(false);
      setMapTitle(createDateBasedMapTitle());
      setMapDescription("");
      setGenerateWithAi(false);

      const result = await createMapFromAi({
        description,
        title: mapTitle.trim() || undefined,
      });

      if (!result.success || !result.map_id) {
        pendingAiMapContext?.setPending(null);
        return;
      }

      toast.success("Mapa mental gerado com sucesso.");
      pendingAiMapContext?.setPending({
        status: "finished",
        mapId: result.map_id,
        title: displayTitle,
      });
      return;
    }

    const normalizedTitle = mapTitle.trim();
    const title = normalizedTitle || createDateBasedMapTitle();
    const { success } = await createMap({
      title,
    });

    if (!success) {
      return;
    }

    toast.success(`Mapa mental "${title}" criado com sucesso.`);
    setIsCreatePopoverOpen(false);
    setMapTitle(createDateBasedMapTitle());
  }

  return {
    handleCreateMap,
    handleCreatePopoverOpenChange,
    handleMapTitleChange,
    handleGenerateWithAiChange,
    handleMapDescriptionChange,
    isCreatePopoverOpen,
    isCreatingMap: isCreating,
    mapTitle,
    mapDescription,
    generateWithAi,
    mapsSummaryText,
  };
}
