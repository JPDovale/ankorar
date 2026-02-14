import { safeCall } from "@/src/utils/safeCall";
import { User } from "../../user/Users/User";
import { Member } from "../Members/Member";
import { createMember } from "../Members/createMember";
import { findMemberByUserIdAndOrgId } from "../Members/fns/findMemberByUserIdAndOrgId";
import { persistMember } from "../Members/fns/persistMember";
import { Organization } from "./Organization";

type UpsertOrganizationMemberInput = {
  user: User;
  organization: Organization;
  features: string[];
};

type UpsertOrganizationMemberResponse = {
  member: Member;
};

export async function upsertOrganizationMember({
  features,
  organization,
  user,
}: UpsertOrganizationMemberInput): Promise<UpsertOrganizationMemberResponse> {
  const memberResult = await safeCall(() =>
    findMemberByUserIdAndOrgId({
      orgId: organization.id,
      userId: user.id,
    }),
  );

  if (memberResult.success) {
    const { member: memberExists } = memberResult.data;
    memberExists.features = features;
    await persistMember({ member: memberExists });
    return { member: memberExists };
  }

  const { member } = await createMember({
    features,
    org_id: organization.id,
    user_id: user.id,
  });

  return { member };
}
