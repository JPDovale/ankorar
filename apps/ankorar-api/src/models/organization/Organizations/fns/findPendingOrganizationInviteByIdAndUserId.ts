import { db } from "@/src/infra/database/pool";
import { OrganizationInviteNotFound } from "@/src/infra/errors/OrganizationInviteNotFound";
import { OrganizationInvite } from "../OrganizationInvite";
import { toOrganizationInviteStatus } from "./toOrganizationInviteStatus";

type FindPendingOrganizationInviteByIdAndUserIdInput = {
  id: string;
  userId: string;
};

type FindPendingOrganizationInviteByIdAndUserIdResponse = {
  organizationInvite: OrganizationInvite;
};

export async function findPendingOrganizationInviteByIdAndUserId({
  id,
  userId,
}: FindPendingOrganizationInviteByIdAndUserIdInput): Promise<FindPendingOrganizationInviteByIdAndUserIdResponse> {
  const inviteOnDb = await db.organizationInvite.findFirst({
    where: {
      id,
      invited_user_id: userId,
      status: "pending",
      deleted_at: null,
    },
  });

  if (!inviteOnDb) {
    throw new OrganizationInviteNotFound();
  }

  const organizationInvite = OrganizationInvite.create(
    {
      email: inviteOnDb.email,
      status: toOrganizationInviteStatus({ status: inviteOnDb.status }),
      organization_id: inviteOnDb.organization_id,
      invited_by_user_id: inviteOnDb.invited_by_user_id,
      invited_user_id: inviteOnDb.invited_user_id,
      responded_at: inviteOnDb.responded_at,
      created_at: inviteOnDb.created_at,
      updated_at: inviteOnDb.updated_at,
      deleted_at: inviteOnDb.deleted_at,
    },
    inviteOnDb.id,
  );

  return { organizationInvite };
}
