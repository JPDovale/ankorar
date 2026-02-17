import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { MapLike } from "./MapLike";
import { unlikeMap } from "./fns/unlikeMap";

type UnlikeForMemberInput = {
  memberId: string;
  mapId: string;
  organizationId: string;
};

type UnlikeForMemberResponse = {
  mapLike: MapLike | null;
};

export async function unlikeForMember({
  memberId,
  mapId,
  organizationId,
}: UnlikeForMemberInput): Promise<UnlikeForMemberResponse> {
  const { Members } = organizationModule;
  const { member } = await Members.fns.findById({ id: memberId });

  if (member.org_id !== organizationId) {
    throw new MemberNotFound();
  }

  return unlikeMap({
    mapId,
    memberId: member.id,
  });
}
