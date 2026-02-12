import { useQuery } from "@tanstack/react-query";
import { getMapRequest, type MapDetails } from "@/services/maps/getMapRequest";

interface UseMapProps {
  id: string;
}

async function getMapByIdQueryFn(id: string): Promise<MapDetails | null> {
  const response = await getMapRequest({
    mapId: id,
  });

  if (response.status === 200 && response.data?.map) {
    return response.data.map;
  }

  return null;
}

export function useMap({ id }: UseMapProps) {
  const mapQuery = useQuery({
    queryKey: ["map", id],
    queryFn: () => getMapByIdQueryFn(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    map: mapQuery.data ?? null,
    isLoadingMap: mapQuery.isPending,
    refetchMap: mapQuery.refetch,
  };
}
