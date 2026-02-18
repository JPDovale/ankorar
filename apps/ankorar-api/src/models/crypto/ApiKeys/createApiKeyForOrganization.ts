import { Organization } from "../../organization/Organizations/Organization";
import { ApiKey } from "./ApiKey";
import { createApiKey } from "./createApiKey";
import { generateSecret } from "./fns/generateSecret";
import { hashSecret } from "./fns/hashSecret";
import { generateUniquePrefix } from "./fns/generateUniquePrefix";
import { organizationApiKeyFeatures } from "../../auth/Auth/fns/availableFeatures";

type CreateApiKeyForOrganizationInput = {
  organization: Organization;
  expires_at?: Date | null;
  features?: string[];
};

type CreateApiKeyForOrganizationResponse = {
  apiKey: ApiKey;
  text: string;
};

export async function createApiKeyForOrganization({
  organization,
  expires_at = null,
  features: requestedFeatures,
}: CreateApiKeyForOrganizationInput): Promise<CreateApiKeyForOrganizationResponse> {
  const secret = generateSecret();
  const hashedSecret = hashSecret({ secret });
  const prefix = generateUniquePrefix();
  const features =
    requestedFeatures?.length ? requestedFeatures : [...organizationApiKeyFeatures];

  const { apiKey } = await createApiKey({
    organization_id: organization.id,
    prefix,
    secret: hashedSecret,
    features,
    expires_at: expires_at ?? null,
  });

  const text = apiKey.getCompleteApiKey(secret);

  return { apiKey, text };
}
