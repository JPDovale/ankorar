import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { createMap } from "./createMap";
import { Map } from "./Map";

type CreateForMemberInput = {
  memberId: string;
  organizationId: string;
  title: string;
};

type CreateForMemberResponse = {
  map: Map;
};

export async function createForMember({
  memberId,
  organizationId,
  title,
}: CreateForMemberInput): Promise<CreateForMemberResponse> {
  const { Members } = organizationModule;
  const { member } = await Members.fns.findById({ id: memberId });

  if (member.org_id !== organizationId) {
    throw new MemberNotFound();
  }

  return createMap({
    member_id: member.id,
    title,
  });
}
