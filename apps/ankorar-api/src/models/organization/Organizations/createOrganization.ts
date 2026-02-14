import { CreateOrganizationProps, Organization } from "./Organization";
import { persistOrganization } from "./fns/persistOrganization";

type CreateOrganizationInput = CreateOrganizationProps;

type CreateOrganizationResponse = {
  organization: Organization;
};

export async function createOrganization(
  props: CreateOrganizationInput,
): Promise<CreateOrganizationResponse> {
  const organization = Organization.create(props);

  await persistOrganization({ organization });

  return { organization };
}
