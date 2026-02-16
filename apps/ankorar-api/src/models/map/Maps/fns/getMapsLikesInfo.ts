import { db } from "@/src/infra/database/pool";

type GetMapsLikesInfoInput = {
  mapIds: string[];
  memberId: string;
};

type MapLikesInfo = {
  likes_count: number;
  liked_by_me: boolean;
};

type GetMapsLikesInfoResponse = Record<string, MapLikesInfo>;

export async function getMapsLikesInfo({
  mapIds,
  memberId,
}: GetMapsLikesInfoInput): Promise<GetMapsLikesInfoResponse> {
  if (mapIds.length === 0) {
    return {};
  }

  const [counts, myLikes] = await Promise.all([
    db.mapLike.groupBy({
      by: ["map_id"],
      where: { map_id: { in: mapIds } },
      _count: { map_id: true },
    }),
    db.mapLike.findMany({
      where: {
        map_id: { in: mapIds },
        member_id: memberId,
      },
      select: { map_id: true },
    }),
  ]);

  const myLikeMapIds = new Set(myLikes.map((r) => r.map_id));
  const countByMapId = new Map(counts.map((c) => [c.map_id, c._count.map_id]));

  const result: GetMapsLikesInfoResponse = {};
  for (const id of mapIds) {
    result[id] = {
      likes_count: countByMapId.get(id) ?? 0,
      liked_by_me: myLikeMapIds.has(id),
    };
  }
  return result;
}
