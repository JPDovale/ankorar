import { Organization } from "../../organization/Organizations/Organization";
import { ApiKey } from "./ApiKey";
import { createApiKey } from "./createApiKey";
import { generateSecret } from "./fns/generateSecret";
import { hashSecret } from "./fns/hashSecret";
import { generateUniquePrefix } from "./fns/generateUniquePrefix";

type CreateApiKeyForOrganizationInput = {
  organization: Organization;
};

type CreateApiKeyForOrganizationResponse = {
  apiKey: ApiKey;
  text: string;
};

export async function createApiKeyForOrganization({
  organization,
}: CreateApiKeyForOrganizationInput): Promise<CreateApiKeyForOrganizationResponse> {
  const secret = generateSecret();
  const hashedSecret = hashSecret({ secret });
  const prefix = generateUniquePrefix();

  const { apiKey } = await createApiKey({
    organization_id: organization.id,
    prefix,
    secret: hashedSecret,
    features: ["create:user:other"],
  });

  const text = apiKey.getCompleteApiKey(secret);

  return { apiKey, text };
}
