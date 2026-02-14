import { db } from "@/src/infra/database/pool";
import { ApiKeyNotFound } from "@/src/infra/errors/ApiKeyNotFound";
import { ApiKey } from "../ApiKey";

type FindApiKeyByPrefixInput = {
  prefix: string;
};

type FindApiKeyByPrefixResponse = {
  apiKey: ApiKey;
};

export async function findApiKeyByPrefix({
  prefix,
}: FindApiKeyByPrefixInput): Promise<FindApiKeyByPrefixResponse> {
  const apiKeyOnDb = await db.apiKey.findUnique({
    where: {
      prefix,
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
