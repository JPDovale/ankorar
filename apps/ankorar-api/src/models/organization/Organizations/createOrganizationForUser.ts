import { User } from "../../user/Users/User";
import { Member } from "../Members/Member";
import { createMember } from "../Members/createMember";
import { Organization } from "./Organization";
import { createOrganization } from "./createOrganization";

type CreateOrganizationForUserInput = {
  user: User;
};

type CreateOrganizationForUserResponse = {
  organization: Organization;
  member: Member;
};

export async function createOrganizationForUser({
  user,
}: CreateOrganizationForUserInput): Promise<CreateOrganizationForUserResponse> {
  const { organization } = await createOrganization({
    name: `Org ${user.name}'s`,
    creator_id: user.id,
  });

  const { member } = await createMember({
    features: ["read:activation_token"],
    org_id: organization.id,
    user_id: user.id,
  });

  return { member, organization };
}
