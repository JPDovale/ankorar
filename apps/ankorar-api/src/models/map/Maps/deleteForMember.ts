import { deleteMap } from "./deleteMap";
import { Map } from "./Map";

type DeleteForMemberInput = {
  mapId: string;
  memberId: string;
};

type DeleteForMemberResponse = {
  map: Map;
};

export async function deleteForMember({
  mapId,
  memberId,
}: DeleteForMemberInput): Promise<DeleteForMemberResponse> {
  return deleteMap({
    id: mapId,
    memberId,
  });
}
