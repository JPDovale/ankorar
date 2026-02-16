import { Prisma } from "@/src/infra/database/prisma/client";
import { db } from "@/src/infra/database/pool";
import { Map } from "../Map";

type PersistMapInput = {
  map: Map;
};

type PersistMapResponse = {
  map: Map;
};

export async function persistMap({
  map,
}: PersistMapInput): Promise<PersistMapResponse> {
  const data = {
    id: map.id,
    member_id: map.member_id,
    title: map.title,
    content: map.content as Prisma.InputJsonValue,
    preview: map.preview,
    created_at: map.created_at,
    updated_at: map.updated_at,
    deleted_at: map.deleted_at,
  };

  if (map.isNewEntity) {
    await db.map.create({
      data,
    });
  }

  if (map.isUpdatedRecently) {
    await db.map.update({
      where: {
        id: map.id,
      },
      data,
    });
  }

  map.forceNotNew();

  return { map };
}
