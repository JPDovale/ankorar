import { useState } from "react";
import { toast } from "sonner";
import { useApiKeys } from "@/hooks/useApiKeys";
import type { OrganizationApiKey } from "../models";
import { dayjs } from "@/lib/dayjs";
import type { ApiKeyPreview } from "@/services/organizations/listApiKeysRequest";

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

export function useOrganizationApiKeys() {
  const { apiKeys: rawApiKeys, createApiKey, isCreatingApiKey } = useApiKeys();
  const [createdApiKeyText, setCreatedApiKeyText] = useState<string | null>(
    null,
  );

  const apiKeys = rawApiKeys.map(mapApiKeyPreviewToOrganizationApiKey);

  async function handleCreateApiKey() {
    const result = await createApiKey();

    if (result.success && result.apiKeyText) {
      setCreatedApiKeyText(result.apiKeyText);
    }
  }

  function handleDismissCreatedApiKey() {
    setCreatedApiKeyText(null);
  }

  function handleCopyCreatedApiKey() {
    if (!createdApiKeyText) return;

    navigator.clipboard.writeText(createdApiKeyText);
    toast.success("Chave copiada para a area de transferencia.");
  }

  function handleRevokeApiKey(apiKey: OrganizationApiKey) {
    toast.info(
      `Placeholder: revogar a chave "${apiKey.prefix}" ainda nao foi integrado.`,
    );
  }

  return {
    apiKeys,
    createdApiKeyText,
    handleCopyCreatedApiKey,
    handleCreateApiKey,
    handleDismissCreatedApiKey,
    handleRevokeApiKey,
    isCreatingApiKey,
  };
}
