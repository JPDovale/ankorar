import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { librariesQueryKey } from "@/hooks/useLibraries";
import { mapQueryKey } from "@/hooks/useMap";
import { mapsQueryKey } from "@/hooks/useMaps";
import { likeMapRequest } from "@/services/maps/likeMapRequest";
import { unlikeMapRequest } from "@/services/maps/unlikeMapRequest";

interface UseMapLikeProps {
  mapId: string;
  initialLikesCount: number;
  initialLikedByMe: boolean;
}

export function useMapLike({
  mapId,
  initialLikesCount,
  initialLikedByMe,
}: UseMapLikeProps) {
  const queryClient = useQueryClient();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [likedByMe, setLikedByMe] = useState(initialLikedByMe);

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setLikedByMe(initialLikedByMe);
  }, [initialLikesCount, initialLikedByMe]);

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: mapQueryKey(mapId) });
    queryClient.invalidateQueries({ queryKey: mapsQueryKey });
    queryClient.invalidateQueries({ queryKey: librariesQueryKey });
  }, [mapId, queryClient]);

  const likeMutation = useMutation({
    mutationFn: () => likeMapRequest({ mapId }),
    onMutate: () => {
      setLikedByMe(true);
      setLikesCount((c) => c + 1);
    },
    onError: () => {
      setLikedByMe(false);
      setLikesCount((c) => Math.max(0, c - 1));
    },
    onSettled: invalidateQueries,
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeMapRequest({ mapId }),
    onMutate: () => {
      setLikedByMe(false);
      setLikesCount((c) => Math.max(0, c - 1));
    },
    onError: () => {
      setLikedByMe(true);
      setLikesCount((c) => c + 1);
    },
    onSettled: invalidateQueries,
  });

  const toggle = useCallback(() => {
    if (likedByMe) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  }, [likedByMe, likeMutation, unlikeMutation]);

  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  return {
    likesCount,
    likedByMe,
    isPending,
    toggle,
  };
}
