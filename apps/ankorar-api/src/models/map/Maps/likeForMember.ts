import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { MapLike } from "./MapLike";
import { likeMap } from "./fns/likeMap";

type LikeForMemberInput = {
  memberId: string;
  mapId: string;
  organizationId: string;
};

type LikeForMemberResponse = {
  mapLike: MapLike;
};

export async function likeForMember({
  memberId,
  mapId,
  organizationId,
}: LikeForMemberInput): Promise<LikeForMemberResponse> {
  const { Members } = organizationModule;
  const { member } = await Members.fns.findById({ id: memberId });

  if (member.org_id !== organizationId) {
    throw new MemberNotFound();
  }

  return likeMap({
    mapId,
    memberId: member.id,
    organizationId,
  });
}
