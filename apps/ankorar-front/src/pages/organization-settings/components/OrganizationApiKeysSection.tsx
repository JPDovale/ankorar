import { Button } from "@/components/ui/button";
import { CreateApiKeyDialog } from "./CreateApiKeyDialog";
import { OrganizationSettingsApiKeyItem } from "./OrganizationSettingsApiKeyItem";
import type { CreateApiKeyExpiration } from "../hooks/useOrganizationApiKeys";
import type { OrganizationApiKey } from "../hooks/useOrganizationSettingsPage";

interface OrganizationApiKeysSectionProps {
  apiKeys: OrganizationApiKey[];
  handleCreateApiKey: (expiration: CreateApiKeyExpiration) => Promise<unknown>;
  handleRevokeApiKey: (apiKey: OrganizationApiKey) => void;
  handleDeleteApiKey: (apiKey: OrganizationApiKey) => void;
  isCreateKeyDialogOpen: boolean;
  setCreateKeyDialogOpen: (open: boolean) => void;
  isCreatingApiKey: boolean;
}

export function OrganizationApiKeysSection({
  apiKeys,
  handleCreateApiKey,
  handleRevokeApiKey,
  handleDeleteApiKey,
  isCreateKeyDialogOpen,
  setCreateKeyDialogOpen,
  isCreatingApiKey,
}: OrganizationApiKeysSectionProps) {
  const hasApiKeys = apiKeys.length > 0;

  return (
    <section
      id="organization-api-keys"
      aria-labelledby="organization-api-keys-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2
            id="organization-api-keys-title"
            className="text-sm font-semibold text-zinc-900"
          >
            Chaves de API
          </h2>
          <p className="text-sm text-zinc-500">
            Gerencie chaves para integracoes com sistemas externos.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isCreatingApiKey}
          onClick={() => setCreateKeyDialogOpen(true)}
        >
          {isCreatingApiKey ? "Gerando..." : "Gerar chave"}
        </Button>
      </div>

      <CreateApiKeyDialog
        open={isCreateKeyDialogOpen}
        onOpenChange={setCreateKeyDialogOpen}
        onSubmit={handleCreateApiKey}
        isCreating={isCreatingApiKey}
      />

      <div className="mt-4">
        {hasApiKeys && (
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm" aria-label="Chaves de API">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                    Chave
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-zinc-500 md:table-cell">
                    Ambiente
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-zinc-500">
                    <span className="sr-only">Acoes</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {apiKeys.map((apiKey) => (
                  <OrganizationSettingsApiKeyItem
                    key={apiKey.id}
                    apiKey={apiKey}
                    onRevoke={handleRevokeApiKey}
                    onDelete={handleDeleteApiKey}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!hasApiKeys && (
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center">
            <p className="text-sm font-medium text-zinc-700">
              Nenhuma chave cadastrada
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Gere uma chave para iniciar integracoes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
