import { db } from "@/src/infra/database/pool";
import { MapNotFound } from "@/src/infra/errors/MapNotFound";
import { JsonValue, Map } from "../Map";

type FindMapByIdInput = {
  id: string;
};

type FindMapByIdResponse = {
  map: Map;
};

export async function findMapById({
  id,
}: FindMapByIdInput): Promise<FindMapByIdResponse> {
  const mapOnDb = await db.map.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!mapOnDb) {
    throw new MapNotFound();
  }

  const map = Map.create(
    {
      member_id: mapOnDb.member_id,
      title: mapOnDb.title,
      content: mapOnDb.content as JsonValue[],
      created_at: mapOnDb.created_at,
      updated_at: mapOnDb.updated_at,
      deleted_at: mapOnDb.deleted_at,
    },
    mapOnDb.id,
  );

  return { map };
}
