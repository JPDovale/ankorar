import { Map } from "./Map";
import { findMapByIdAndMemberId } from "./fns/findMapByIdAndMemberId";
import { persistMap } from "./fns/persistMap";

type DeleteMapInput = {
  id: string;
  memberId: string;
};

type DeleteMapResponse = {
  map: Map;
};

export async function deleteMap({
  id,
  memberId,
}: DeleteMapInput): Promise<DeleteMapResponse> {
  const { map } = await findMapByIdAndMemberId({
    id,
    memberId,
  });

  map.markAsDeleted();

  await persistMap({ map });

  return { map };
}
