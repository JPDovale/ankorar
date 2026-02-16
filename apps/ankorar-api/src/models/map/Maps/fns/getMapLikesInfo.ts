import { db } from "@/src/infra/database/pool";

type GetMapLikesInfoInput = {
  mapId: string;
  memberId: string;
};

type GetMapLikesInfoResponse = {
  likes_count: number;
  liked_by_me: boolean;
};

export async function getMapLikesInfo({
  mapId,
  memberId,
}: GetMapLikesInfoInput): Promise<GetMapLikesInfoResponse> {
  const [likesCount, myLike] = await Promise.all([
    db.mapLike.count({
      where: { map_id: mapId },
    }),
    db.mapLike.findUnique({
      where: {
        map_id_member_id: { map_id: mapId, member_id: memberId },
      },
    }),
  ]);

  return {
    likes_count: likesCount,
    liked_by_me: myLike !== null,
  };
}
