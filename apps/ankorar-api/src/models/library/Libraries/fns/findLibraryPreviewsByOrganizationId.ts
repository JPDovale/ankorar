import type { LibraryPreviewMapItem } from "../types/LibraryPreview";
import { LibraryPreview } from "../types/LibraryPreview";
import { findLibraryPreviewsDataByOrganizationId } from "./findLibraryPreviewsDataByOrganizationId";
import { getMapsLikesInfo } from "@/src/models/map/Maps/fns/getMapsLikesInfo";

type FindLibraryPreviewsByOrganizationIdInput = {
  organizationId: string;
  memberId: string;
};

type FindLibraryPreviewsByOrganizationIdResponse = {
  libraries: LibraryPreview[];
};

export async function findLibraryPreviewsByOrganizationId({
  organizationId,
  memberId,
}: FindLibraryPreviewsByOrganizationIdInput): Promise<FindLibraryPreviewsByOrganizationIdResponse> {
  const { libraries } = await findLibraryPreviewsDataByOrganizationId({
    organizationId,
  });

  const allMapIds = libraries.flatMap(({ maps }) => maps.map((m) => m.id));
  const likesInfo =
    allMapIds.length > 0
      ? await getMapsLikesInfo({ mapIds: allMapIds, memberId })
      : {};

  const librariesPreview = libraries.map(({ library, maps }) => {
    const mapsData: LibraryPreviewMapItem[] = maps.map((map) => {
      const info = likesInfo[map.id] ?? {
        likes_count: 0,
        liked_by_me: false,
      };
      return {
        id: map.id,
        title: map.title,
        created_at: map.created_at,
        updated_at: map.updated_at,
        likes_count: info.likes_count,
        liked_by_me: info.liked_by_me,
        preview: map.preview,
        generated_by_ai: map.generated_by_ai,
      };
    });
    return LibraryPreview.create({
      id: library.id,
      name: library.name,
      created_at: library.created_at,
      updated_at: library.updated_at,
      maps: mapsData,
    });
  });

  return { libraries: librariesPreview };
}
