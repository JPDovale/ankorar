import { Organization } from "../../organization/Organizations/Organization";
import { ApiKey } from "./ApiKey";
import { createApiKey } from "./createApiKey";
import { generateSecret } from "./fns/generateSecret";
import { hashSecret } from "./fns/hashSecret";
import { generateUniquePrefix } from "./fns/generateUniquePrefix";
import { availableFeatures } from "../../auth/Auth/fns/availableFeatures";

type CreateApiKeyForOrganizationInput = {
  organization: Organization;
  expires_at?: Date | null;
};

type CreateApiKeyForOrganizationResponse = {
  apiKey: ApiKey;
  text: string;
};

export async function createApiKeyForOrganization({
  organization,
  expires_at = null,
}: CreateApiKeyForOrganizationInput): Promise<CreateApiKeyForOrganizationResponse> {
  const secret = generateSecret();
  const hashedSecret = hashSecret({ secret });
  const prefix = generateUniquePrefix();

  const { apiKey } = await createApiKey({
    organization_id: organization.id,
    prefix,
    secret: hashedSecret,
    features: availableFeatures,
    expires_at: expires_at ?? null,
  });

  const text = apiKey.getCompleteApiKey(secret);

  return { apiKey, text };
}
