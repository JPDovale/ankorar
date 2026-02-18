import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { getPlanMemberFeatures } from "@/src/models/subscription/planConfig";
import { authModule } from "../../auth/AuthModule";
import { organizationModule } from "../../organization/OrganizationModule";
import { Member } from "../../organization/Members/Member";
import { Organization } from "../../organization/Organizations/Organization";
import { User } from "./User";
import { findUserById } from "./fns/findUserById";

type ActivateUserByIdInput = {
  id: string;
};

type ActivateUserByIdResponse = {
  user: User;
  organization: Organization;
  member: Member;
};

export async function activateUserById({
  id,
}: ActivateUserByIdInput): Promise<ActivateUserByIdResponse> {
  const { Organizations, Members } = organizationModule;

  const { user } = await findUserById({ id });
  const { organization, member } = await Organizations.createForUser({
    user,
  });

  if (
    !authModule.Auth.can({
      user,
      organization,
      member,
      feature: "read:activation_token",
    })
  ) {
    throw new PermissionDenied();
  }

  member.features = [
    ...getPlanMemberFeatures(user.stripe_price_id),
    "create:organization_invite", // owner da org pode convidar
  ];
  await Members.fns.persist({ member });

  return { user, organization, member };
}
