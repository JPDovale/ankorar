import { Organization } from "./Organization";
import { findOrganizationById } from "./fns/findOrganizationById";
import { persistOrganization } from "./fns/persistOrganization";

type UpdateOrganizationInput = {
  organization_id: string;
  name?: string;
};

type UpdateOrganizationResponse = {
  organization: Organization;
};

export async function updateOrganization({
  organization_id,
  name,
}: UpdateOrganizationInput): Promise<UpdateOrganizationResponse> {
  const { organization } = await findOrganizationById({
    id: organization_id,
  });

  if (name !== undefined) {
    organization.name = name.trim();
    await persistOrganization({ organization });
  }

  return { organization };
}
