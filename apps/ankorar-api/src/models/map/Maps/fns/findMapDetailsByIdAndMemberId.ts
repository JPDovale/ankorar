import { db } from "@/src/infra/database/pool";
import { MapNotFound } from "@/src/infra/errors/MapNotFound";
import { JsonValue } from "../Map";
import { MapDetails } from "../types/MapDetails";

type FindMapDetailsByIdAndMemberIdInput = {
  id: string;
  /** Id do membro dono do mapa; o mapa só é retornado se member_id do mapa for igual a ownerMemberId */
  ownerMemberId: string;
};

type FindMapDetailsByIdAndMemberIdResponse = {
  map: MapDetails;
};

export async function findMapDetailsByIdAndMemberId({
  id,
  ownerMemberId,
}: FindMapDetailsByIdAndMemberIdInput): Promise<FindMapDetailsByIdAndMemberIdResponse> {
  const mapOnDb = await db.map.findFirst({
    where: {
      id,
      member_id: ownerMemberId, // mapa deve ser do membro dono
      deleted_at: null,
    },
    include: {
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!mapOnDb) {
    throw new MapNotFound();
  }

  const likesCount = mapOnDb._count.likes;

  const mapDetails = MapDetails.create({
    id: mapOnDb.id,
    title: mapOnDb.title,
    content: mapOnDb.content as JsonValue[],
    created_at: mapOnDb.created_at,
    updated_at: mapOnDb.updated_at,
    can_edit: false,
    likes_count: likesCount,
    liked_by_me: false,
  });

  return { map: mapDetails };
}
