import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { OrganizationApiKey, OrganizationMember } from "../types";

const organizationIdentitySchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres.")
    .max(120, "O nome precisa ter no maximo 120 caracteres."),
});

type OrganizationIdentityFormData = z.infer<typeof organizationIdentitySchema>;

const organizationApiKeys: OrganizationApiKey[] = [
  {
    id: "api-key-1",
    name: "Integracao CRM",
    prefix: "ank_live_9x3p",
    environment: "production",
    status: "active",
    createdAtLabel: "Criada em 03/02/2026",
    lastUsedAtLabel: "Ultimo uso ha 2 horas",
  },
  {
    id: "api-key-2",
    name: "Automacao interna",
    prefix: "ank_dev_1k8m",
    environment: "development",
    status: "active",
    createdAtLabel: "Criada em 29/01/2026",
    lastUsedAtLabel: "Ultimo uso ha 1 dia",
  },
];

const organizationMembers: OrganizationMember[] = [
  {
    id: "member-1",
    name: "Joao Silva",
    email: "joao@ankorar.com",
    role: "owner",
    status: "active",
  },
  {
    id: "member-2",
    name: "Maria Costa",
    email: "maria@ankorar.com",
    role: "admin",
    status: "active",
  },
  {
    id: "member-3",
    name: "Pedro Lima",
    email: "pedro@ankorar.com",
    role: "member",
    status: "invited",
  },
];

export function useOrganizationSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isSubmittingIdentity },
  } = useForm<OrganizationIdentityFormData>({
    resolver: zodResolver(organizationIdentitySchema),
    mode: "onSubmit",
    defaultValues: {
      organizationName: "Ankorar Labs",
    },
  });

  const organizationNameErrorMessage = errors.organizationName?.message;
  const apiKeys = organizationApiKeys;
  const members = organizationMembers;

  async function onValidIdentitySubmit(payload: OrganizationIdentityFormData) {
    const normalizedName = payload.organizationName.trim();
    toast.info(
      `Placeholder: salvar nome da organizacao para "${normalizedName}" quando a API estiver disponivel.`,
    );
  }

  function onInvalidIdentitySubmit() {
    const firstErrorMessage = Object.values(errors)[0]?.message;
    toast.error(firstErrorMessage ?? "Verifique os dados do formulario.");
  }

  function handleCreateApiKey() {
    toast.info("Placeholder: geracao de chave de API ainda nao foi integrada.");
  }

  function handleCopyApiKeyPrefix(apiKey: OrganizationApiKey) {
    toast.info(
      `Placeholder: copiar prefixo da chave "${apiKey.name}" (${apiKey.prefix}).`,
    );
  }

  function handleRevokeApiKey(apiKey: OrganizationApiKey) {
    toast.info(`Placeholder: revogar a chave "${apiKey.name}".`);
  }

  function handleInviteMember() {
    toast.info("Placeholder: convite de usuario ainda nao foi integrado.");
  }

  function handleChangeMemberRole(member: OrganizationMember) {
    toast.info(`Placeholder: alterar perfil do usuario "${member.name}".`);
  }

  function handleRemoveMember(member: OrganizationMember) {
    toast.info(`Placeholder: remover acesso do usuario "${member.name}".`);
  }

  return {
    apiKeys,
    handleChangeMemberRole,
    handleCopyApiKeyPrefix,
    handleCreateApiKey,
    handleIdentitySubmit: handleSubmit(onValidIdentitySubmit, onInvalidIdentitySubmit),
    handleInviteMember,
    handleRemoveMember,
    handleRevokeApiKey,
    isSubmittingIdentity,
    members,
    organizationNameErrorMessage,
    register,
  };
}
