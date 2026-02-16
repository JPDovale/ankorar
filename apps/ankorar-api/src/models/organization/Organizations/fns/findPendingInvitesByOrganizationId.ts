import { db } from "@/src/infra/database/pool";
import { OrganizationInvite } from "../OrganizationInvite";

type FindPendingInvitesByOrganizationIdInput = {
  organizationId: string;
};

type InviteWithUser = {
  invite: OrganizationInvite;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type FindPendingInvitesByOrganizationIdResponse = {
  invites: InviteWithUser[];
};

export async function findPendingInvitesByOrganizationId({
  organizationId,
}: FindPendingInvitesByOrganizationIdInput): Promise<FindPendingInvitesByOrganizationIdResponse> {
  const invitesOnDb = await db.organizationInvite.findMany({
    where: {
      organization_id: organizationId,
      status: "pending",
      deleted_at: null,
    },
    include: {
      invited_user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const invites = invitesOnDb.map((inviteOnDb) => ({
    invite: OrganizationInvite.create(
      {
        email: inviteOnDb.email,
        organization_id: inviteOnDb.organization_id,
        invited_by_user_id: inviteOnDb.invited_by_user_id,
        invited_user_id: inviteOnDb.invited_user_id,
        status: inviteOnDb.status as "pending" | "accepted" | "rejected",
        responded_at: inviteOnDb.responded_at,
        created_at: inviteOnDb.created_at,
        updated_at: inviteOnDb.updated_at,
        deleted_at: inviteOnDb.deleted_at,
      },
      inviteOnDb.id,
    ),
    user: {
      id: inviteOnDb.invited_user.id,
      name: inviteOnDb.invited_user.name,
      email: inviteOnDb.invited_user.email,
    },
  }));

  return { invites };
}
