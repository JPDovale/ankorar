import { db } from "@/src/infra/database/pool";
import { ApiKeyNotFound } from "@/src/infra/errors/ApiKeyNotFound";
import { ApiKey } from "../ApiKey";

type FindApiKeyByIdAndOrganizationIdInput = {
  id: string;
  organization_id: string;
};

type FindApiKeyByIdAndOrganizationIdResponse = {
  apiKey: ApiKey;
};

export async function findApiKeyByIdAndOrganizationId({
  id,
  organization_id,
}: FindApiKeyByIdAndOrganizationIdInput): Promise<FindApiKeyByIdAndOrganizationIdResponse> {
  const apiKeyOnDb = await db.apiKey.findFirst({
    where: {
      id,
      organization_id,
      deleted_at: null,
    },
  });

  if (!apiKeyOnDb) {
    throw new ApiKeyNotFound();
  }

  const apiKey = ApiKey.create(
    {
      features: apiKeyOnDb.features,
      organization_id: apiKeyOnDb.organization_id,
      prefix: apiKeyOnDb.prefix,
      secret: apiKeyOnDb.secret,
      created_at: apiKeyOnDb.created_at,
      deleted_at: apiKeyOnDb.deleted_at,
      env: apiKeyOnDb.env as "live" | "test",
      expires_at: apiKeyOnDb.expires_at,
      last_used_at: apiKeyOnDb.last_used_at,
      revoked_at: apiKeyOnDb.revoked_at,
      updated_at: apiKeyOnDb.updated_at,
    },
    apiKeyOnDb.id,
  );

  return { apiKey };
}
