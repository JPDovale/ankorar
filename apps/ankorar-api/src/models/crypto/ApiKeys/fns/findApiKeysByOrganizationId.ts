import { db } from "@/src/infra/database/pool";
import { ApiKey } from "../ApiKey";

type FindApiKeysByOrganizationIdInput = {
  organization_id: string;
};

type FindApiKeysByOrganizationIdResponse = {
  apiKeys: ApiKey[];
};

export async function findApiKeysByOrganizationId({
  organization_id,
}: FindApiKeysByOrganizationIdInput): Promise<FindApiKeysByOrganizationIdResponse> {
  const apiKeysOnDb = await db.apiKey.findMany({
    where: {
      organization_id,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const apiKeys = apiKeysOnDb.map((apiKeyOnDb) =>
    ApiKey.create(
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
    ),
  );

  return { apiKeys };
}
