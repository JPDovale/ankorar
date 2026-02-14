import { db } from "@/src/infra/database/pool";
import { Library } from "../Library";

type FindLibrariesByOrganizationIdInput = {
  organizationId: string;
};

type FindLibrariesByOrganizationIdResponse = {
  libraries: Library[];
};

export async function findLibrariesByOrganizationId({
  organizationId,
}: FindLibrariesByOrganizationIdInput): Promise<FindLibrariesByOrganizationIdResponse> {
  const librariesOnDb = await db.library.findMany({
    where: {
      organization_id: organizationId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const libraries = librariesOnDb.map((libraryOnDb) =>
    Library.create(
      {
        organization_id: libraryOnDb.organization_id,
        name: libraryOnDb.name,
        created_at: libraryOnDb.created_at,
        updated_at: libraryOnDb.updated_at,
        deleted_at: libraryOnDb.deleted_at,
      },
      libraryOnDb.id,
    ),
  );

  return { libraries };
}
