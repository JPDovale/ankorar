import { db } from "@/src/infra/database/pool";
import { ValidationError } from "@/src/infra/errors/ValidationError";
import { dateModule } from "../../date/DateModule";
import { OrganizationInvite } from "./OrganizationInvite";
import { normalizeOrganizationInviteEmail } from "./fns/normalizeOrganizationInviteEmail";
import { persistOrganizationInvite } from "./fns/persistOrganizationInvite";

type CreateOrganizationInviteInput = {
  organizationId: string;
  invitedByUserId: string;
  email: string;
};

type CreateOrganizationInviteResponse = {
  organizationInvite: OrganizationInvite;
};

export async function createOrganizationInvite({
  organizationId,
  invitedByUserId,
  email,
}: CreateOrganizationInviteInput): Promise<CreateOrganizationInviteResponse> {
  const normalizedEmail = normalizeOrganizationInviteEmail({ email });

  const userOnDb = await db.user.findFirst({
    where: {
      email: normalizedEmail,
      deleted_at: null,
    },
  });

  if (!userOnDb) {
    throw new ValidationError({
      message: "Usuario convidado nao encontrado.",
      action: "Use o e-mail de um usuario ja cadastrado.",
    });
  }

  const pendingInvite = await db.organizationInvite.findFirst({
    where: {
      organization_id: organizationId,
      invited_user_id: userOnDb.id,
      status: "pending",
      deleted_at: null,
    },
  });

  if (pendingInvite) {
    throw new ValidationError({
      message: "Ja existe um convite pendente para este usuario.",
      action: "Aguarde a resposta do convite atual.",
    });
  }

  const memberOnDb = await db.member.findFirst({
    where: {
      org_id: organizationId,
      user_id: userOnDb.id,
      deleted_at: null,
    },
  });

  if (memberOnDb) {
    throw new ValidationError({
      message: "Usuario ja faz parte desta organizacao.",
      action: "Use outro e-mail para enviar o convite.",
    });
  }

  const organizationInvite = OrganizationInvite.create({
    email: normalizedEmail,
    organization_id: organizationId,
    invited_by_user_id: invitedByUserId,
    invited_user_id: userOnDb.id,
    status: "pending",
    responded_at: null,
    created_at: dateModule.Date.nowUtcDate(),
    updated_at: null,
    deleted_at: null,
  });

  await persistOrganizationInvite({ organizationInvite });

  return { organizationInvite };
}
