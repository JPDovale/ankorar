import { Can } from "@/components/auth/Can";
import { Button } from "@/components/ui/button";
import { OrganizationSettingsMemberItem } from "./OrganizationSettingsMemberItem";
import type { OrganizationMember } from "../hooks/useOrganizationSettingsPage";

interface OrganizationMembersSectionProps {
  members: OrganizationMember[];
  handleChangeMemberRole: (member: OrganizationMember) => void;
  handleInviteMember: () => void;
  handleRemoveMember: (member: OrganizationMember) => void;
}

export function OrganizationMembersSection({
  members,
  handleChangeMemberRole,
  handleInviteMember,
  handleRemoveMember,
}: OrganizationMembersSectionProps) {
  const hasMembers = members.length > 0;

  return (
    <section
      id="organization-members"
      aria-labelledby="organization-members-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2
            id="organization-members-title"
            className="text-sm font-semibold text-zinc-900"
          >
            Usuarios e acessos
          </h2>
          <p className="text-sm text-zinc-500">
            Controle quem tem acesso e qual perfil de cada membro.
          </p>
        </div>

        <Can feature="create:organization_invite">
          <Button variant="outline" size="sm" onClick={handleInviteMember}>
            Convidar
          </Button>
        </Can>
      </div>

      <div className="mt-4">
        {hasMembers && (
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table
              className="w-full text-sm"
              aria-label="Membros da organizacao"
            >
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                    Usuario
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-zinc-500 sm:table-cell">
                    Perfil
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
                {members.map((member) => (
                  <OrganizationSettingsMemberItem
                    key={member.id}
                    member={member}
                    onChangeRole={handleChangeMemberRole}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!hasMembers && (
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center">
            <p className="text-sm font-medium text-zinc-700">
              Nenhum usuario com acesso
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Convide membros para distribuir responsabilidades.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
