import { db } from "@/src/infra/database/pool";
import { OrganizationInvite } from "../OrganizationInvite";

type PersistOrganizationInviteInput = {
  organizationInvite: OrganizationInvite;
};

type PersistOrganizationInviteResponse = {
  organizationInvite: OrganizationInvite;
};

export async function persistOrganizationInvite({
  organizationInvite,
}: PersistOrganizationInviteInput): Promise<PersistOrganizationInviteResponse> {
  const data = {
    id: organizationInvite.id,
    email: organizationInvite.email,
    status: organizationInvite.status,
    organization_id: organizationInvite.organization_id,
    invited_by_user_id: organizationInvite.invited_by_user_id,
    invited_user_id: organizationInvite.invited_user_id,
    responded_at: organizationInvite.responded_at,
    created_at: organizationInvite.created_at,
    updated_at: organizationInvite.updated_at,
    deleted_at: organizationInvite.deleted_at,
  };

  if (organizationInvite.isNewEntity) {
    await db.organizationInvite.create({
      data,
    });
  }

  if (organizationInvite.isUpdatedRecently) {
    await db.organizationInvite.update({
      where: {
        id: organizationInvite.id,
      },
      data,
    });
  }

  organizationInvite.forceNotNew();

  return { organizationInvite };
}
