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
  const hasExpiration = apiKey.expires_at != null && apiKey.expires_at !== "";
  const expiresAt = hasExpiration ? apiKey.expires_at : null;
  const expiresAtLabel = hasExpiration
    ? `Expira em ${dayjs(apiKey.expires_at).format("DD/MM/YYYY")}`
    : "Chave permanente";
  const isExpired =
    expiresAt !== null &&
    (dayjs().isAfter(dayjs(expiresAt), "day") ||
      dayjs().isSame(dayjs(expiresAt), "day"));

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
    expiresAt,
    expiresAtLabel,
    isExpired,
  };
}

export type CreateApiKeyExpiration = "permanent" | { expires_at: string };

export type CreateApiKeyPayload = {
  expiration: CreateApiKeyExpiration;
  features?: string[];
};

export function useOrganizationApiKeys() {
  const {
    apiKeys: rawApiKeys,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
    isCreatingApiKey,
  } = useApiKeys();
  const [createdApiKeyText, setCreatedApiKeyText] = useState<string | null>(
    null,
  );

  const apiKeys = rawApiKeys.map(mapApiKeyPreviewToOrganizationApiKey);

  const [isCreateKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);

  async function handleCreateApiKey(payload: CreateApiKeyPayload) {
    const { expiration, features } = payload;
    const body =
      expiration === "permanent"
        ? { expires_at: null, features }
        : { expires_at: expiration.expires_at, features };

    const result = await createApiKey(body);

    if (result.success && result.apiKeyText) {
      setCreateKeyDialogOpen(false);
      setCreatedApiKeyText(result.apiKeyText);
    }

    return result;
  }

  function handleDismissCreatedApiKey() {
    setCreatedApiKeyText(null);
  }

  function handleCopyCreatedApiKey() {
    if (!createdApiKeyText) return;

    navigator.clipboard.writeText(createdApiKeyText);
    toast.success("Chave copiada para a area de transferencia.");
  }

  async function handleRevokeApiKey(apiKey: OrganizationApiKey) {
    await revokeApiKey(apiKey.id);
  }

  async function handleDeleteApiKey(apiKey: OrganizationApiKey) {
    await deleteApiKey(apiKey.id);
  }

  return {
    apiKeys,
    createdApiKeyText,
    handleCopyCreatedApiKey,
    handleCreateApiKey,
    handleDismissCreatedApiKey,
    handleRevokeApiKey,
    handleDeleteApiKey,
    isCreateKeyDialogOpen,
    setCreateKeyDialogOpen,
    isCreatingApiKey,
  };
}
