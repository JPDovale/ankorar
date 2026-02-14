import { db } from "@/src/infra/database/pool";
import { User } from "../../user/Users/User";
import { createMember } from "../Members/createMember";
import { OrganizationInvite } from "./OrganizationInvite";
import { findPendingOrganizationInviteByIdAndUserId } from "./fns/findPendingOrganizationInviteByIdAndUserId";
import { persistOrganizationInvite } from "./fns/persistOrganizationInvite";

type AcceptOrganizationInviteInput = {
  inviteId: string;
  user: User;
};

type AcceptOrganizationInviteResponse = {
  organizationInvite: OrganizationInvite;
};

export async function acceptOrganizationInvite({
  inviteId,
  user,
}: AcceptOrganizationInviteInput): Promise<AcceptOrganizationInviteResponse> {
  const { organizationInvite } = await findPendingOrganizationInviteByIdAndUserId(
    {
      id: inviteId,
      userId: user.id,
    },
  );

  const memberOnDb = await db.member.findFirst({
    where: {
      org_id: organizationInvite.organization_id,
      user_id: user.id,
      deleted_at: null,
    },
  });

  if (!memberOnDb) {
    await createMember({
      user_id: user.id,
      org_id: organizationInvite.organization_id,
      features: ["read:session", "read:organization"],
    });
  }

  organizationInvite.markAsAccepted();
  await persistOrganizationInvite({ organizationInvite });

  return { organizationInvite };
}
