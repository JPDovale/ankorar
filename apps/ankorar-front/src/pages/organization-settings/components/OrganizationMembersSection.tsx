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
            className="text-sm font-semibold text-zinc-900 dark:text-ds-white transition-colors duration-200"
          >
            Usuarios e acessos
          </h2>
          <p className="text-sm text-zinc-500 dark:text-navy-300 transition-colors duration-200">
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
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-navy-700/60">
            <table
              className="w-full text-sm"
              aria-label="Membros da organizacao"
            >
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-navy-700/60 dark:bg-navy-800/60">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-navy-300">
                    Usuario
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-navy-300 sm:table-cell">
                    Perfil
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-navy-300">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-zinc-500 dark:text-navy-300">
                    <span className="sr-only">Acoes</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-navy-800">
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
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-navy-700/60">
            <p className="text-sm font-medium text-zinc-700 dark:text-navy-100">
              Nenhum usuario com acesso
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-navy-300">
              Convide membros para distribuir responsabilidades.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
