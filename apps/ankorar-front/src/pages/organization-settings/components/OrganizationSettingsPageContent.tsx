import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import { useOrganizationSettingsPage } from "../hooks/useOrganizationSettingsPage";
import { CreatedApiKeyDialog } from "./CreatedApiKeyDialog";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { OrganizationApiKeysSection } from "./OrganizationApiKeysSection";
import { OrganizationIdentitySection } from "./OrganizationIdentitySection";
import { OrganizationMembersSection } from "./OrganizationMembersSection";

export function OrganizationSettingsPageContent() {
  const { can } = useUser();
  const {
    apiKeys,
    createdApiKeyText,
    handleChangeMemberRole,
    handleCloseInviteDialog,
    handleCopyCreatedApiKey,
    handleCreateApiKey,
    handleDeleteApiKey,
    handleDismissCreatedApiKey,
    handleIdentitySubmit,
    handleInviteMember,
    handleInviteSubmit,
    handleRemoveMember,
    handleRevokeApiKey,
    inviteForm,
    isCreateKeyDialogOpen,
    isCreatingApiKey,
    isCreatingInvite,
    isInviteDialogOpen,
    isSubmittingIdentity,
    members,
    organizationNameErrorMessage,
    register,
    formOrganizationName,
    setCreateKeyDialogOpen,
  } = useOrganizationSettingsPage();

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
        {can("update:organization") && (
          <OrganizationIdentitySection
            organizationNameErrorMessage={organizationNameErrorMessage}
            handleIdentitySubmit={handleIdentitySubmit}
            isSubmittingIdentity={isSubmittingIdentity}
            register={register}
            formOrganizationName={formOrganizationName}
          />
        )}

        {can("update:organization") &&
          (can("read:api_key") || can("read:organization_members")) && (
          <Separator />
        )}

        {can("read:api_key") && (
          <OrganizationApiKeysSection
            apiKeys={apiKeys}
            handleCreateApiKey={handleCreateApiKey}
            handleRevokeApiKey={handleRevokeApiKey}
            handleDeleteApiKey={handleDeleteApiKey}
            isCreateKeyDialogOpen={isCreateKeyDialogOpen}
            setCreateKeyDialogOpen={setCreateKeyDialogOpen}
            isCreatingApiKey={isCreatingApiKey}
          />
        )}

        {can("read:api_key") && can("read:organization_members") && (
          <Separator />
        )}

        {can("read:organization_members") && (
          <OrganizationMembersSection
            members={members}
            handleChangeMemberRole={handleChangeMemberRole}
            handleInviteMember={handleInviteMember}
            handleRemoveMember={handleRemoveMember}
          />
        )}

        {!can("update:organization") &&
          !can("read:api_key") &&
          !can("read:organization_members") && (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 px-4 py-8 text-center text-sm text-zinc-500">
              Você não tem permissão para ver nenhuma configuração nesta
              organização.
            </p>
          )}
      </div>

      <CreatedApiKeyDialog
        apiKeyText={createdApiKeyText}
        onCopy={handleCopyCreatedApiKey}
        onDismiss={handleDismissCreatedApiKey}
      />

      <InviteMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseInviteDialog();
        }}
        onSubmit={handleInviteSubmit}
        register={inviteForm.register}
        errorMessage={inviteForm.formState.errors.email?.message}
        isSubmitting={isCreatingInvite}
      />
    </section>
  );
}
