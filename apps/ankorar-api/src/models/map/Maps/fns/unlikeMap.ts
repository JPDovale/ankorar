import { findMapLikeByMapIdAndMemberId } from "./findMapLikeByMapIdAndMemberId";
import { deleteMapLike } from "./deleteMapLike";
import { MapLike } from "../MapLike";

type UnlikeMapInput = {
  mapId: string;
  memberId: string;
};

type UnlikeMapResponse = {
  mapLike: MapLike | null;
};

export async function unlikeMap({
  mapId,
  memberId,
}: UnlikeMapInput): Promise<UnlikeMapResponse> {
  const { mapLike } = await findMapLikeByMapIdAndMemberId({
    mapId,
    memberId,
  });

  if (!mapLike) {
    return { mapLike: null };
  }

  await deleteMapLike({ mapLike });

  return { mapLike };
}
