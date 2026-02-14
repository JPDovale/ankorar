import { db } from "@/src/infra/database/pool";
import { Organization } from "../Organization";

type FindOrganizationByCreatorIdInput = {
  id: string;
};

type FindOrganizationByCreatorIdResponse = {
  organization: Organization;
};

export async function findOrganizationByCreatorId({
  id,
}: FindOrganizationByCreatorIdInput): Promise<FindOrganizationByCreatorIdResponse> {
  const organizationOnDb = await db.organization.findUnique({
    where: {
      creator_id: id,
    },
  });

  if (!organizationOnDb) {
    throw new Error("Organization not found");
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
