import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrganizationApiKey } from "../types";

interface OrganizationSettingsApiKeyItemProps {
  apiKey: OrganizationApiKey;
  onCopyPrefix: (apiKey: OrganizationApiKey) => void;
  onRevoke: (apiKey: OrganizationApiKey) => void;
}

export function OrganizationSettingsApiKeyItem({
  apiKey,
  onCopyPrefix,
  onRevoke,
}: OrganizationSettingsApiKeyItemProps) {
  const environmentLabel =
    apiKey.environment === "production" ? "Producao" : "Dev";
  const statusLabel = apiKey.status === "active" ? "Ativa" : "Revogada";
  const isActive = apiKey.status === "active";

  return (
    <tr className="bg-white transition-colors hover:bg-zinc-50/60">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-zinc-900">{apiKey.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {apiKey.createdAtLabel}
          </p>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-600">
          {apiKey.prefix}
        </code>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <Badge variant="outline" className="border-zinc-200 text-zinc-600">
          {environmentLabel}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          data-status={apiKey.status}
          className="border-zinc-200 text-zinc-600 data-[status=active]:border-emerald-200 data-[status=active]:bg-emerald-50 data-[status=active]:text-emerald-700"
        >
          {statusLabel}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-zinc-600"
            onClick={() => onCopyPrefix(apiKey)}
          >
            Copiar
          </Button>
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onRevoke(apiKey)}
            >
              Revogar
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
