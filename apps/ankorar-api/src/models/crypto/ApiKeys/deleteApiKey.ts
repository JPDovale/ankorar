import { ApiKeyNotRevokedCannotBeDeleted } from "@/src/infra/errors/ApiKeyNotRevokedCannotBeDeleted";
import { ApiKey } from "./ApiKey";
import { findApiKeyByIdAndOrganizationId } from "./fns/findApiKeyByIdAndOrganizationId";
import { persistApiKey } from "./fns/persistApiKey";

type DeleteApiKeyInput = {
  id: string;
  organization_id: string;
};

type DeleteApiKeyResponse = {
  apiKey: ApiKey;
};

export async function deleteApiKey({
  id,
  organization_id,
}: DeleteApiKeyInput): Promise<DeleteApiKeyResponse> {
  const { apiKey } = await findApiKeyByIdAndOrganizationId({
    id,
    organization_id,
  });

  if (apiKey.revoked_at === null) {
    throw new ApiKeyNotRevokedCannotBeDeleted();
  }

  apiKey.markAsDeleted();
  await persistApiKey({ apiKey });

  return { apiKey };
}
