import { db } from "@/src/infra/database/pool";
import { User } from "../../user/Users/User";
import { createMember } from "../Members/createMember";
import { OrganizationInvite } from "./OrganizationInvite";
import { findPendingOrganizationInviteByIdAndUserId } from "./fns/findPendingOrganizationInviteByIdAndUserId";
import { persistOrganizationInvite } from "./fns/persistOrganizationInvite";
import { MemberAlreadyInOrganization } from "@/src/infra/errors/MemberAlreadyInOrganization";
import { persistMember } from "../Members/fns/persistMember";
import { Member } from "../Members/Member";

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
  const { organizationInvite } =
    await findPendingOrganizationInviteByIdAndUserId({
      id: inviteId,
      userId: user.id,
    });

  const memberOnDb = await db.member.findFirst({
    where: {
      org_id: organizationInvite.organization_id,
      user_id: user.id,
    },
  });

  if (memberOnDb && memberOnDb.deleted_at === null) {
    throw new MemberAlreadyInOrganization();
  }

  if (memberOnDb && memberOnDb.deleted_at !== null) {
    const member = Member.create(
      {
        features: memberOnDb.features,
        user_id: memberOnDb.user_id,
        org_id: memberOnDb.org_id,
        created_at: memberOnDb.created_at,
        updated_at: memberOnDb.updated_at,
        deleted_at: memberOnDb.deleted_at,
      },
      memberOnDb.id,
    );

    member.markAsNotDeleted();
    await persistMember({ member });
  }

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
