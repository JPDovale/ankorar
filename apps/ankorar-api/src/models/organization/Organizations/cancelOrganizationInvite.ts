import { OrganizationInvite } from "./OrganizationInvite";
import { findPendingOrganizationInviteByIdAndOrganizationId } from "./fns/findPendingOrganizationInviteByIdAndOrganizationId";
import { persistOrganizationInvite } from "./fns/persistOrganizationInvite";

type CancelOrganizationInviteInput = {
  inviteId: string;
  organizationId: string;
};

type CancelOrganizationInviteResponse = {
  organizationInvite: OrganizationInvite;
};

export async function cancelOrganizationInvite({
  inviteId,
  organizationId,
}: CancelOrganizationInviteInput): Promise<CancelOrganizationInviteResponse> {
  const { organizationInvite } =
    await findPendingOrganizationInviteByIdAndOrganizationId({
      id: inviteId,
      organizationId,
    });

  organizationInvite.markAsDeleted();
  await persistOrganizationInvite({ organizationInvite });

  return { organizationInvite };
}
