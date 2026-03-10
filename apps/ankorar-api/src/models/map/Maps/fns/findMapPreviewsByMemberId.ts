import { db } from "@/src/infra/database/pool";
import { MapPreview } from "../types/MapPreview";

type FindMapPreviewsByMemberIdInput = {
  memberId: string;
};

type FindMapPreviewsByMemberIdResponse = {
  maps: MapPreview[];
};

export async function findMapPreviewsByMemberId({
  memberId,
}: FindMapPreviewsByMemberIdInput): Promise<FindMapPreviewsByMemberIdResponse> {
  const rows = await db.map.findMany({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
      preview: true,
      generated_by_ai: true,
      _count: {
        select: { likes: true },
      },
    },
  });

  const maps = rows.map((row) =>
    MapPreview.create({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      updated_at: row.updated_at,
      likes_count: row._count.likes,
      preview: row.preview,
      generated_by_ai: row.generated_by_ai,
    }),
  );

  return { maps };
}
