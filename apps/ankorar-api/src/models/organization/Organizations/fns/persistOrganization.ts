import { db } from "@/src/infra/database/pool";
import { Organization } from "../Organization";

type PersistOrganizationInput = {
  organization: Organization;
};

type PersistOrganizationResponse = {
  organization: Organization;
};

export async function persistOrganization({
  organization,
}: PersistOrganizationInput): Promise<PersistOrganizationResponse> {
  const data = {
    id: organization.id,
    name: organization.name,
    creator_id: organization.creator_id,
    created_at: organization.created_at,
    updated_at: organization.updated_at,
    deleted_at: organization.deleted_at,
  };

  if (organization.isNewEntity) {
    await db.organization.create({
      data,
    });
  }

  if (organization.isUpdatedRecently) {
    await db.organization.update({
      where: {
        id: organization.id,
      },
      data,
    });
  }

  return { organization };
}
