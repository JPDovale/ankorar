import { db } from "@/src/infra/database/pool";
import { MapNotFound } from "@/src/infra/errors/MapNotFound";
import { JsonValue } from "../Map";
import { MapDetails } from "../types/MapDetails";

type FindMapDetailsByIdAndOrganizationIdInput = {
  id: string;
  organizationId: string;
  memberId: string;
};

type FindMapDetailsByIdAndOrganizationIdResponse = {
  map: MapDetails;
};

export async function findMapDetailsByIdAndOrganizationId({
  id,
  organizationId,
  memberId,
}: FindMapDetailsByIdAndOrganizationIdInput): Promise<FindMapDetailsByIdAndOrganizationIdResponse> {
  const mapOnDb = await db.map.findFirst({
    where: {
      id,
      deleted_at: null,
      member: {
        is: {
          org_id: organizationId,
          deleted_at: null,
        },
      },
    },
    include: {
      _count: {
        select: { likes: true },
      },
      likes: {
        where: { member_id: memberId },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!mapOnDb) {
    throw new MapNotFound();
  }

  const likesCount = mapOnDb._count.likes;
  const likedByMe = mapOnDb.likes.length > 0;
  const canEdit = mapOnDb.member_id === memberId;

  const mapDetails = MapDetails.create({
    id: mapOnDb.id,
    title: mapOnDb.title,
    content: mapOnDb.content as JsonValue[],
    created_at: mapOnDb.created_at,
    updated_at: mapOnDb.updated_at,
    can_edit: canEdit,
    likes_count: likesCount,
    liked_by_me: likedByMe,
  });

  return { map: mapDetails };
}
