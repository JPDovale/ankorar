import { db } from "@/src/infra/database/pool";
import { MapLike } from "../MapLike";

type FindMapLikeByMapIdAndMemberIdInput = {
  mapId: string;
  memberId: string;
};

type FindMapLikeByMapIdAndMemberIdResponse = {
  mapLike: MapLike | null;
};

export async function findMapLikeByMapIdAndMemberId({
  mapId,
  memberId,
}: FindMapLikeByMapIdAndMemberIdInput): Promise<FindMapLikeByMapIdAndMemberIdResponse> {
  const mapLikeOnDb = await db.mapLike.findUnique({
    where: {
      map_id_member_id: { map_id: mapId, member_id: memberId },
    },
  });

  if (!mapLikeOnDb) {
    return { mapLike: null };
  }

  const mapLike = MapLike.create(
    {
      map_id: mapLikeOnDb.map_id,
      member_id: mapLikeOnDb.member_id,
      created_at: mapLikeOnDb.created_at,
    },
    mapLikeOnDb.id,
  );

  return { mapLike };
}
