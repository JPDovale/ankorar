import { db } from "@/src/infra/database/pool";
import { ApiKey } from "../ApiKey";

type PersistApiKeyInput = {
  apiKey: ApiKey;
};

type PersistApiKeyResponse = {
  apiKey: ApiKey;
};

export async function persistApiKey({
  apiKey,
}: PersistApiKeyInput): Promise<PersistApiKeyResponse> {
  const data = {
    created_at: apiKey.created_at,
    env: apiKey.env,
    id: apiKey.id,
    last_used_at: apiKey.last_used_at,
    secret: apiKey.secret,
    prefix: apiKey.prefix,
    deleted_at: apiKey.deleted_at,
    expires_at: apiKey.expires_at,
    features: apiKey.features,
    organization_id: apiKey.organization_id,
    revoked_at: apiKey.revoked_at,
    updated_at: apiKey.updated_at,
  };

  if (apiKey.isNewEntity) {
    await db.apiKey.create({
      data,
    });
  }

  if (apiKey.isUpdatedRecently) {
    await db.apiKey.update({
      where: { id: apiKey.id },
      data,
    });
  }

  return { apiKey };
}
