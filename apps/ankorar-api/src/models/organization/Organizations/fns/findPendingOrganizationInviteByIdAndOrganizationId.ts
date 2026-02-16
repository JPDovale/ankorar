import { db } from "@/src/infra/database/pool";
import { OrganizationInviteNotFound } from "@/src/infra/errors/OrganizationInviteNotFound";
import { OrganizationInvite } from "../OrganizationInvite";
import { toOrganizationInviteStatus } from "./toOrganizationInviteStatus";

type FindPendingOrganizationInviteByIdAndOrganizationIdInput = {
  id: string;
  organizationId: string;
};

type FindPendingOrganizationInviteByIdAndOrganizationIdResponse = {
  organizationInvite: OrganizationInvite;
};

export async function findPendingOrganizationInviteByIdAndOrganizationId({
  id,
  organizationId,
}: FindPendingOrganizationInviteByIdAndOrganizationIdInput): Promise<FindPendingOrganizationInviteByIdAndOrganizationIdResponse> {
  const inviteOnDb = await db.organizationInvite.findFirst({
    where: {
      id,
      organization_id: organizationId,
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
      organization_id: inviteOnDb.organization_id,
      invited_by_user_id: inviteOnDb.invited_by_user_id,
      invited_user_id: inviteOnDb.invited_user_id,
      status: toOrganizationInviteStatus({ status: inviteOnDb.status }),
      responded_at: inviteOnDb.responded_at,
      created_at: inviteOnDb.created_at,
      updated_at: inviteOnDb.updated_at,
      deleted_at: inviteOnDb.deleted_at,
    },
    inviteOnDb.id,
  );

  return { organizationInvite };
}
