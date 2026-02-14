import { db } from "@/src/infra/database/pool";
import { OrganizationInvitePreview } from "./types";

type ListPendingOrganizationInvitesByUserIdInput = {
  userId: string;
};

type ListPendingOrganizationInvitesByUserIdResponse = {
  invites: OrganizationInvitePreview[];
};

export async function listPendingOrganizationInvitesByUserId({
  userId,
}: ListPendingOrganizationInvitesByUserIdInput): Promise<ListPendingOrganizationInvitesByUserIdResponse> {
  const invitesOnDb = await db.organizationInvite.findMany({
    where: {
      invited_user_id: userId,
      status: "pending",
      deleted_at: null,
      organization: {
        deleted_at: null,
      },
    },
    include: {
      organization: true,
      invited_by_user: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return {
    invites: invitesOnDb.map((inviteOnDb) => ({
      id: inviteOnDb.id,
      email: inviteOnDb.email,
      status: inviteOnDb.status,
      created_at: inviteOnDb.created_at,
      organization: {
        id: inviteOnDb.organization.id,
        name: inviteOnDb.organization.name,
      },
      invited_by_user: {
        id: inviteOnDb.invited_by_user.id,
        name: inviteOnDb.invited_by_user.name,
        email: inviteOnDb.invited_by_user.email,
      },
    })),
  };
}
