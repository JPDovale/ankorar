import { db } from "@/src/infra/database/pool";
import { LibraryNotFound } from "@/src/infra/errors/LibraryNotFound";
import { Library } from "../Library";

type FindLibraryByIdAndOrganizationIdInput = {
  id: string;
  organizationId: string;
};

type FindLibraryByIdAndOrganizationIdResponse = {
  library: Library;
};

export async function findLibraryByIdAndOrganizationId({
  id,
  organizationId,
}: FindLibraryByIdAndOrganizationIdInput): Promise<FindLibraryByIdAndOrganizationIdResponse> {
  const libraryOnDb = await db.library.findFirst({
    where: {
      id,
      organization_id: organizationId,
      deleted_at: null,
    },
  });

  if (!libraryOnDb) {
    throw new LibraryNotFound();
  }

  const library = Library.create(
    {
      organization_id: libraryOnDb.organization_id,
      name: libraryOnDb.name,
      created_at: libraryOnDb.created_at,
      updated_at: libraryOnDb.updated_at,
      deleted_at: libraryOnDb.deleted_at,
    },
    libraryOnDb.id,
  );

  return { library };
}
