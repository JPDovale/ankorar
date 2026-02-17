import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { JsonValue } from "@/src/models/map/Maps/Map";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { updateMapNodeContent } from "./updateMapNodeContent";
import { Map } from "./Map";

type UpdateForMemberInput = {
  mapId: string;
  memberId: string;
  organizationId: string;
  content: JsonValue[];
  preview?: string | null;
};

type UpdateForMemberResponse = {
  map: Map;
};

export async function updateForMember({
  mapId,
  memberId,
  organizationId,
  content,
  preview,
}: UpdateForMemberInput): Promise<UpdateForMemberResponse> {
  const { Members } = organizationModule;
  const { member } = await Members.fns.findById({ id: memberId });

  if (member.org_id !== organizationId) {
    throw new MemberNotFound();
  }

  return updateMapNodeContent({
    id: mapId,
    memberId: member.id,
    content,
    preview,
  });
}
