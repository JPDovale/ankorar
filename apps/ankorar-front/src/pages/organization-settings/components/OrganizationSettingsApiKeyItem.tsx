import { Can } from "@/components/auth/Can";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrganizationApiKey } from "../hooks/useOrganizationSettingsPage";

const ENV_LABELS: Record<OrganizationApiKey["env"], string> = {
  live: "Producao",
  test: "Teste",
};

interface OrganizationSettingsApiKeyItemProps {
  apiKey: OrganizationApiKey;
  onRevoke: (apiKey: OrganizationApiKey) => void;
  onDelete: (apiKey: OrganizationApiKey) => void;
}

export function OrganizationSettingsApiKeyItem({
  apiKey,
  onRevoke,
  onDelete,
}: OrganizationSettingsApiKeyItemProps) {
  const environmentLabel = ENV_LABELS[apiKey.env];
  const statusLabel = apiKey.isExpired
    ? "Expirada"
    : apiKey.status === "active"
      ? "Ativa"
      : "Revogada";
  const statusKind = apiKey.isExpired
    ? "expired"
    : apiKey.status === "active"
      ? "active"
      : "revoked";
  const isActive = apiKey.status === "active";

  return (
    <tr className="bg-white transition-colors hover:bg-zinc-50/60 dark:bg-navy-900 dark:hover:bg-navy-800/60">
      <td className="px-4 py-3">
        <div>
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-600 dark:bg-navy-800 dark:text-navy-200">
            {apiKey.partialKey}
          </code>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-xs text-zinc-500 dark:text-navy-300">{apiKey.createdAtLabel}</p>
            <p className="text-xs text-zinc-500 dark:text-navy-300">{apiKey.lastUsedAtLabel}</p>
            <p className="text-xs text-zinc-500 dark:text-navy-300">{apiKey.expiresAtLabel}</p>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <Badge variant="outline" className="border-zinc-200 text-zinc-600 dark:border-navy-700 dark:text-navy-200">
          {environmentLabel}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          data-status={statusKind}
          className="border-zinc-200 text-zinc-600 data-[status=active]:border-emerald-200 data-[status=active]:bg-emerald-50 data-[status=active]:text-emerald-700 data-[status=expired]:border-amber-200 data-[status=expired]:bg-amber-50 data-[status=expired]:text-amber-700 dark:border-navy-700 dark:text-navy-200 dark:data-[status=active]:border-emerald-500/40 dark:data-[status=active]:bg-emerald-400/10 dark:data-[status=active]:text-emerald-300 dark:data-[status=expired]:border-amber-500/40 dark:data-[status=expired]:bg-amber-400/10 dark:data-[status=expired]:text-amber-300"
        >
          {statusLabel}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Can feature="create:api_key">
            {isActive && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-400/10 dark:hover:text-red-200"
                onClick={() => onRevoke(apiKey)}
                aria-label="Revogar chave"
              >
                Revogar
              </Button>
            )}
            {!isActive && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-400/10 dark:hover:text-red-200"
                onClick={() => onDelete(apiKey)}
                aria-label="Excluir chave"
              >
                Excluir
              </Button>
            )}
          </Can>
        </div>
      </td>
    </tr>
  );
}
