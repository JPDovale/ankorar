import { db } from "@/src/infra/database/pool";
import { MapLikeOwnMapNotAllowed } from "@/src/infra/errors/MapLikeOwnMapNotAllowed";
import { MapNotFound } from "@/src/infra/errors/MapNotFound";
import { dateModule } from "@/src/models/date/DateModule";
import { findMapLikeByMapIdAndMemberId } from "./findMapLikeByMapIdAndMemberId";
import { persistMapLike } from "./persistMapLike";
import { MapLike } from "../MapLike";

type LikeMapInput = {
  mapId: string;
  memberId: string;
  organizationId: string;
};

type LikeMapResponse = {
  mapLike: MapLike;
};

export async function likeMap({
  mapId,
  memberId,
  organizationId,
}: LikeMapInput): Promise<LikeMapResponse> {
  const mapOnDb = await db.map.findFirst({
    where: {
      id: mapId,
      deleted_at: null,
      member: {
        is: {
          org_id: organizationId,
          deleted_at: null,
        },
      },
    },
  });

  if (!mapOnDb) {
    throw new MapNotFound();
  }

  if (mapOnDb.member_id === memberId) {
    throw new MapLikeOwnMapNotAllowed();
  }

  const { mapLike: existing } = await findMapLikeByMapIdAndMemberId({
    mapId,
    memberId,
  });
  if (existing) {
    return { mapLike: existing };
  }

  const mapLike = MapLike.create({
    map_id: mapId,
    member_id: memberId,
    created_at: dateModule.Date.nowUtcDate(),
  });

  await persistMapLike({ mapLike });

  return { mapLike };
}
