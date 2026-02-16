import { db } from "@/src/infra/database/pool";
import { MapLike } from "../MapLike";

type PersistMapLikeInput = {
  mapLike: MapLike;
};

type PersistMapLikeResponse = {
  mapLike: MapLike;
};

export async function persistMapLike({
  mapLike,
}: PersistMapLikeInput): Promise<PersistMapLikeResponse> {
  if (mapLike.isNewEntity) {
    await db.mapLike.create({
      data: {
        id: mapLike.id,
        map_id: mapLike.map_id,
        member_id: mapLike.member_id,
        created_at: mapLike.created_at,
      },
    });
  }

  mapLike.forceNotNew();

  return { mapLike };
}
