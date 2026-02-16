import { dayjs } from "@/lib/dayjs";
import type { ApiKeyPreview } from "@/services/organizations/listApiKeysRequest";
import type { OrganizationApiKey } from "../models";

export function mapApiKeyPreviewToOrganizationApiKey(
  apiKey: ApiKeyPreview,
): OrganizationApiKey {
  const createdAt = dayjs(apiKey.created_at);
  const lastUsedAt = dayjs(apiKey.last_used_at);
  const isRevoked = apiKey.revoked_at !== null;
  const wasNeverUsed = createdAt.isSame(lastUsedAt, "second");

  const partialKey = `ak_org_${apiKey.env}_${apiKey.prefix}_****`;

  return {
    id: apiKey.id,
    prefix: apiKey.prefix,
    partialKey,
    env: apiKey.env as "live" | "test",
    features: apiKey.features,
    status: isRevoked ? "revoked" : "active",
    createdAtLabel: `Criada em ${createdAt.format("DD/MM/YYYY")}`,
    lastUsedAtLabel: wasNeverUsed
      ? "Nao usado"
      : `Ultimo uso ${lastUsedAt.fromNow()}`,
  };
}
