import { db } from "@/src/infra/database/pool";
import { JsonValue, Map } from "../Map";

type FindMapsByMemberIdInput = {
  memberId: string;
};

type FindMapsByMemberIdResponse = {
  maps: Map[];
};

export async function findMapsByMemberId({
  memberId,
}: FindMapsByMemberIdInput): Promise<FindMapsByMemberIdResponse> {
  const mapsOnDb = await db.map.findMany({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const maps = mapsOnDb.map((mapOnDb) =>
    Map.create(
      {
        member_id: mapOnDb.member_id,
        title: mapOnDb.title,
        content: mapOnDb.content as JsonValue[],
        created_at: mapOnDb.created_at,
        updated_at: mapOnDb.updated_at,
        deleted_at: mapOnDb.deleted_at,
      },
      mapOnDb.id,
    ),
  );

  return { maps };
}
