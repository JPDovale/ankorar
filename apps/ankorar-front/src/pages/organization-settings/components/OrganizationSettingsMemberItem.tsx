import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrganizationMember } from "../hooks/useOrganizationSettingsPage";

const ROLE_LABELS: Record<OrganizationMember["role"], string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Membro",
};

const STATUS_LABELS: Record<OrganizationMember["status"], string> = {
  active: "Ativo",
  invited: "Pendente",
};

interface OrganizationSettingsMemberItemProps {
  member: OrganizationMember;
  onChangeRole: (member: OrganizationMember) => void;
  onRemove: (member: OrganizationMember) => void;
}

export function OrganizationSettingsMemberItem({
  member,
  onChangeRole,
  onRemove,
}: OrganizationSettingsMemberItemProps) {
  const roleLabel = ROLE_LABELS[member.role];
  const statusLabel = STATUS_LABELS[member.status];

  return (
    <tr className="bg-white transition-colors hover:bg-zinc-50/60">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-zinc-900">{member.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{member.email}</p>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <Badge variant="outline" className="border-zinc-200 text-zinc-600">
          {roleLabel}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          data-status={member.status}
          className="border-zinc-200 text-zinc-600 data-[status=invited]:border-amber-200 data-[status=invited]:bg-amber-50 data-[status=invited]:text-amber-700"
        >
          {statusLabel}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {member.status === "active" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-zinc-600"
              onClick={() => onChangeRole(member)}
              aria-label={`Alterar perfil de ${member.name}`}
            >
              Alterar perfil
            </Button>
          )}
          {member.role !== "owner" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onRemove(member)}
              aria-label={`Remover ${member.name}`}
            >
              {member.status === "invited" ? "Cancelar convite" : "Remover"}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
