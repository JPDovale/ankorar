import { db } from "@/src/infra/database/pool";
import { OrganizationNotFound } from "@/src/infra/errors/OrganizationNotFound";
import { Organization } from "../Organization";

type FindOrganizationByIdInput = {
  id: string;
};

type FindOrganizationByIdResponse = {
  organization: Organization;
};

export async function findOrganizationById({
  id,
}: FindOrganizationByIdInput): Promise<FindOrganizationByIdResponse> {
  const organizationOnDb = await db.organization.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!organizationOnDb) {
    throw new OrganizationNotFound();
  }

  const organization = Organization.create(
    {
      name: organizationOnDb.name,
      creator_id: organizationOnDb.creator_id,
      created_at: organizationOnDb.created_at,
      updated_at: organizationOnDb.updated_at,
    },
    organizationOnDb.id,
  );

  return { organization };
}
