import { useMaps, useSuspenseMaps } from "@/hooks/useMaps";
import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";
import { createDateBasedMapTitle } from "@/utils/createDateBasedMapTitle";
import { useState } from "react";
import { toast } from "sonner";

export function useHomePageHeader() {
  const { data: maps } = useSuspenseMaps();
  const { createMap, isCreatingMap } = useMaps();
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);
  const [mapTitle, setMapTitle] = useState(() => createDateBasedMapTitle());

  const mapsCount = maps.length;
  const nowInSaoPaulo = dayjs().tz(SAO_PAULO_TIMEZONE);
  const createdTodayCount = maps.filter((map) =>
    dayjs(map.created_at).tz(SAO_PAULO_TIMEZONE).isSame(nowInSaoPaulo, "day"),
  ).length;
  const mapsSummaryText = `Você tem ${mapsCount} mapa${mapsCount === 1 ? "" : "s"} mental${mapsCount === 1 ? "" : "is"} na organização atual.`;
  const createdTodayText = `${createdTodayCount} criado${createdTodayCount === 1 ? "" : "s"} hoje`;

  function handleCreatePopoverOpenChange(isOpen: boolean) {
    if (isCreatingMap) {
      return;
    }

    setIsCreatePopoverOpen(isOpen);
  }

  function handleMapTitleChange(nextTitle: string) {
    setMapTitle(nextTitle);
  }

  async function handleCreateMap() {
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
    createdTodayText,
    handleCreateMap,
    handleCreatePopoverOpenChange,
    handleMapTitleChange,
    isCreatePopoverOpen,
    isCreatingMap,
    mapTitle,
    mapsSummaryText,
  };
}
