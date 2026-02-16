import { db } from "@/src/infra/database/pool";
import { MapLike } from "../MapLike";

type DeleteMapLikeInput = {
  mapLike: MapLike;
};

type DeleteMapLikeResponse = {
  mapLike: MapLike;
};

export async function deleteMapLike({
  mapLike,
}: DeleteMapLikeInput): Promise<DeleteMapLikeResponse> {
  await db.mapLike.delete({
    where: {
      id: mapLike.id,
    },
  });

  return { mapLike };
}
