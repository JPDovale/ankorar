import { Button } from "@/components/ui/button";
import { Input, InputBox, InputError, InputRoot } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrganizationSettingsPage } from "../hooks/useOrganizationSettingsPage";
import { OrganizationSettingsApiKeyItem } from "./OrganizationSettingsApiKeyItem";
import { OrganizationSettingsMemberItem } from "./OrganizationSettingsMemberItem";

export function OrganizationSettingsPageContent() {
  const {
    apiKeys,
    handleChangeMemberRole,
    handleCopyApiKeyPrefix,
    handleCreateApiKey,
    handleIdentitySubmit,
    handleInviteMember,
    handleRemoveMember,
    handleRevokeApiKey,
    isSubmittingIdentity,
    members,
    organizationNameErrorMessage,
    register,
  } = useOrganizationSettingsPage();

  const hasApiKeys = apiKeys.length > 0;
  const hasMembers = members.length > 0;

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Configuracoes
        </h1>
        <p className="text-sm text-zinc-500">
          Gerencie identidade, integracoes e acessos da organizacao.
        </p>
      </header>

      <div className="space-y-10">
        <section
          id="organization-identity"
          aria-labelledby="organization-identity-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2
                id="organization-identity-title"
                className="text-sm font-semibold text-zinc-900"
              >
                Identidade
              </h2>
              <p className="text-sm text-zinc-500">
                Nome exibido para o time nos ambientes internos.
              </p>
            </div>
          </div>

          <form
            id="organization-identity-form"
            className="mt-4 max-w-md"
            onSubmit={handleIdentitySubmit}
          >
            <InputRoot disabled={isSubmittingIdentity}>
              <label
                htmlFor="organization-settings-name"
                className="text-xs font-medium text-zinc-600"
              >
                Nome da organizacao
              </label>

              <InputBox
                data-disabled={isSubmittingIdentity}
                data-has-error={Boolean(organizationNameErrorMessage)}
                className="mt-1 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-600"
              >
                <Input
                  id="organization-settings-name"
                  type="text"
                  placeholder="Digite o nome da organizacao"
                  disabled={isSubmittingIdentity}
                  {...register("organizationName")}
                />
              </InputBox>

              {organizationNameErrorMessage && (
                <InputError role="alert">
                  {organizationNameErrorMessage}
                </InputError>
              )}
            </InputRoot>

            <Button
              type="submit"
              size="sm"
              className="mt-3"
              disabled={isSubmittingIdentity}
            >
              Salvar
            </Button>
          </form>
        </section>

        <Separator />

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
              onClick={handleCreateApiKey}
            >
              Gerar chave
            </Button>
          </div>

          <div className="mt-4">
            {hasApiKeys && (
              <div className="overflow-hidden rounded-lg border border-zinc-200">
                <table className="w-full text-sm" aria-label="Chaves de API">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/80">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                        Nome
                      </th>
                      <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-zinc-500 sm:table-cell">
                        Prefixo
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
                        onCopyPrefix={handleCopyApiKeyPrefix}
                        onRevoke={handleRevokeApiKey}
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

        <Separator />

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

            <Button
              variant="outline"
              size="sm"
              onClick={handleInviteMember}
            >
              Convidar
            </Button>
          </div>

          <div className="mt-4">
            {hasMembers && (
              <div className="overflow-hidden rounded-lg border border-zinc-200">
                <table className="w-full text-sm" aria-label="Membros da organizacao">
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
      </div>
    </section>
  );
}
