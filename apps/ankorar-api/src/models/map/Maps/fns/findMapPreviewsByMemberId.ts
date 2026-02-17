import { MapPreview } from "../types/MapPreview";
import { findMapsByMemberId } from "./findMapsByMemberId";
import { getMapsLikesInfo } from "./getMapsLikesInfo";

type FindMapPreviewsByMemberIdInput = {
  memberId: string;
};

type FindMapPreviewsByMemberIdResponse = {
  maps: MapPreview[];
};

export async function findMapPreviewsByMemberId({
  memberId,
}: FindMapPreviewsByMemberIdInput): Promise<FindMapPreviewsByMemberIdResponse> {
  const { maps } = await findMapsByMemberId({
    memberId,
  });

  const mapIds = maps.map((m) => m.id);
  const likesInfo =
    mapIds.length > 0
      ? await getMapsLikesInfo({
          mapIds,
          memberId,
        })
      : {};

  const mapsPreview = maps.map((map) => {
    const info = likesInfo[map.id] ?? { likes_count: 0, liked_by_me: false };
    return MapPreview.create({
      id: map.id,
      title: map.title,
      created_at: map.created_at,
      updated_at: map.updated_at,
      likes_count: info.likes_count,
      preview: map.preview,
      generated_by_ai: map.generated_by_ai,
    });
  });

  return { maps: mapsPreview };
}
