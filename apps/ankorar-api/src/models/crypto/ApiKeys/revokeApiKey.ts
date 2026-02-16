import { ApiKey } from "./ApiKey";
import { findApiKeyByIdAndOrganizationId } from "./fns/findApiKeyByIdAndOrganizationId";
import { persistApiKey } from "./fns/persistApiKey";

type RevokeApiKeyInput = {
  id: string;
  organization_id: string;
};

type RevokeApiKeyResponse = {
  apiKey: ApiKey;
};

export async function revokeApiKey({
  id,
  organization_id,
}: RevokeApiKeyInput): Promise<RevokeApiKeyResponse> {
  const { apiKey } = await findApiKeyByIdAndOrganizationId({
    id,
    organization_id,
  });

  apiKey.markAsRevoked();
  await persistApiKey({ apiKey });

  return { apiKey };
}
