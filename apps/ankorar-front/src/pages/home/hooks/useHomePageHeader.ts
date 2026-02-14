import { useMaps, useSuspenseMaps } from "@/hooks/useMaps";
import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";
import { createDateBasedMapTitle } from "@/utils/createDateBasedMapTitle";
import { toast } from "sonner";

export function useHomePageHeader() {
  const { data: maps } = useSuspenseMaps();
  const { createMap, isCreatingMap } = useMaps();

  const mapsCount = maps.length;
  const nowInSaoPaulo = dayjs().tz(SAO_PAULO_TIMEZONE);
  const createdTodayCount = maps.filter((map) =>
    dayjs(map.created_at).tz(SAO_PAULO_TIMEZONE).isSame(nowInSaoPaulo, "day"),
  ).length;
  const mapsSummaryText = `Você tem ${mapsCount} mapa${mapsCount === 1 ? "" : "s"} mental${mapsCount === 1 ? "" : "is"} na organização atual.`;
  const createdTodayText = `${createdTodayCount} criado${createdTodayCount === 1 ? "" : "s"} hoje`;
  const createButtonText = isCreatingMap ? "Criando mapa mental..." : "Criar mapa mental";

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

  return {
    createdTodayText,
    createButtonText,
    handleCreateMap,
    isCreatingMap,
    mapsSummaryText,
  };
}
