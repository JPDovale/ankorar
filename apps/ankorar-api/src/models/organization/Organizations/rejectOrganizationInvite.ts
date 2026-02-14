import { User } from "../../user/Users/User";
import { OrganizationInvite } from "./OrganizationInvite";
import { findPendingOrganizationInviteByIdAndUserId } from "./fns/findPendingOrganizationInviteByIdAndUserId";
import { persistOrganizationInvite } from "./fns/persistOrganizationInvite";

type RejectOrganizationInviteInput = {
  inviteId: string;
  user: User;
};

type RejectOrganizationInviteResponse = {
  organizationInvite: OrganizationInvite;
};

export async function rejectOrganizationInvite({
  inviteId,
  user,
}: RejectOrganizationInviteInput): Promise<RejectOrganizationInviteResponse> {
  const { organizationInvite } = await findPendingOrganizationInviteByIdAndUserId(
    {
      id: inviteId,
      userId: user.id,
    },
  );

  organizationInvite.markAsRejected();
  await persistOrganizationInvite({ organizationInvite });

  return { organizationInvite };
}
