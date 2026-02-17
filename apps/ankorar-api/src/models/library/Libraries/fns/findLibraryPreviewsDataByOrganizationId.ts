import { db } from "@/src/infra/database/pool";
import { Library } from "../Library";

type FindLibraryPreviewsDataByOrganizationIdInput = {
  organizationId: string;
};

type LibraryPreviewMapItemData = {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date | null;
  preview: string | null;
  generated_by_ai: boolean;
};

type FindLibraryPreviewsDataByOrganizationIdResponse = {
  libraries: Array<{
    library: Library;
    maps: LibraryPreviewMapItemData[];
  }>;
};

export async function findLibraryPreviewsDataByOrganizationId({
  organizationId,
}: FindLibraryPreviewsDataByOrganizationIdInput): Promise<FindLibraryPreviewsDataByOrganizationIdResponse> {
  const librariesOnDb = await db.library.findMany({
    where: {
      organization_id: organizationId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      maps: {
        include: {
          map: {
            select: {
              id: true,
              title: true,
              created_at: true,
              updated_at: true,
              deleted_at: true,
              preview: true,
              generated_by_ai: true,
            },
          },
        },
      },
    },
  });

  const libraries = librariesOnDb.map((libraryOnDb) => {
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

    const maps = libraryOnDb.maps
      .map((libraryMapOnDb) => libraryMapOnDb.map)
      .filter((mapOnDb) => mapOnDb.deleted_at === null)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .map((mapOnDb) => ({
        id: mapOnDb.id,
        title: mapOnDb.title,
        created_at: mapOnDb.created_at,
        updated_at: mapOnDb.updated_at,
        preview: mapOnDb.preview,
        generated_by_ai: mapOnDb.generated_by_ai,
      }));

    return {
      library,
      maps,
    };
  });

  return { libraries };
}
