import { Prisma } from "@/src/infra/database/prisma/client";
import { db } from "@/src/infra/database/pool";
import { Library } from "../Library";

type PersistLibraryInput = {
  library: Library;
};

type PersistLibraryResponse = {
  library: Library;
};

export async function persistLibrary({
  library,
}: PersistLibraryInput): Promise<PersistLibraryResponse> {
  const data = {
    id: library.id,
    organization_id: library.organization_id,
    name: library.name,
    created_at: library.created_at,
    updated_at: library.updated_at,
    deleted_at: library.deleted_at,
  };

  if (library.isNewEntity) {
    await db.library.create({
      data,
    });
  }

  if (library.isUpdatedRecently) {
    await db.library.update({
      where: {
        id: library.id,
      },
      data: data as Prisma.LibraryUpdateInput,
    });
  }

  library.forceNotNew();

  return { library };
}
