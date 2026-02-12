import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { CreateOrganizationInviteRequestBody } from "@/services/organizations/createOrganizationInviteRequest";
import type { OrganizationInvitePreview } from "@/services/organizations/listOrganizationInvitesRequest";
import type { OrganizationOption } from "@/types/auth";
import {
  Check,
  CheckCheck,
  ChevronsUpDown,
  LoaderCircle,
  MailPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrganizationSwitcherProps {
  organizations: OrganizationOption[];
  selectedOrgId: string;
  onSelectOrganization: (orgId: string) => void;
  invites: OrganizationInvitePreview[];
  isLoadingInvites: boolean;
  createInvite: (
    payload: CreateOrganizationInviteRequestBody,
  ) => Promise<{ success: boolean }>;
  acceptInvite: (payload: {
    inviteId: string;
  }) => Promise<{ success: boolean }>;
  rejectInvite: (payload: {
    inviteId: string;
  }) => Promise<{ success: boolean }>;
  isCreatingInvite: boolean;
  isAcceptingInvite: boolean;
  isRejectingInvite: boolean;
}

export function OrganizationSwitcher({
  organizations,
  selectedOrgId,
  onSelectOrganization,
  invites,
  isLoadingInvites,
  createInvite,
  acceptInvite,
  rejectInvite,
  isCreatingInvite,
  isAcceptingInvite,
  isRejectingInvite,
}: OrganizationSwitcherProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [handlingInviteId, setHandlingInviteId] = useState<string | null>(null);
  const shouldShowPendingInvites = !isLoadingInvites && invites.length > 0;

  const selectedOrganization =
    organizations.find((organization) => organization.id === selectedOrgId) ??
    organizations[0];

  if (!selectedOrganization) {
    return null;
  }

  async function handleCreateInvite() {
    const normalizedEmail = inviteEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Informe um e-mail para enviar o convite.");
      return;
    }

    const { success } = await createInvite({
      email: normalizedEmail,
    });

    if (!success) {
      return;
    }

    toast.success(`Convite enviado para ${normalizedEmail}.`);
    setInviteEmail("");
  }

  async function handleAcceptInvite(invite: OrganizationInvitePreview) {
    setHandlingInviteId(invite.id);
    const { success } = await acceptInvite({
      inviteId: invite.id,
    });
    setHandlingInviteId(null);

    if (!success) {
      return;
    }

    toast.success(
      `Convite da organização "${invite.organization.name}" aceito.`,
    );
  }

  async function handleRejectInvite(invite: OrganizationInvitePreview) {
    setHandlingInviteId(invite.id);
    const { success } = await rejectInvite({
      inviteId: invite.id,
    });
    setHandlingInviteId(null);

    if (!success) {
      return;
    }

    toast.success(
      `Convite da organização "${invite.organization.name}" rejeitado.`,
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 gap-3 px-2 sm:px-3">
          <span className="flex size-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-semibold text-zinc-50">
            {selectedOrganization.slug.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden flex-col text-left sm:flex">
            <span className="text-xs text-zinc-500">Organizacao</span>
            <span className="text-sm font-medium leading-none">
              {selectedOrganization.name}
            </span>
          </span>
          <ChevronsUpDown className="size-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[360px] p-2">
        <div className="px-2 py-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Trocar organizacao
          </p>
        </div>

        <div className="space-y-1">
          {organizations.map((organization) => {
            const isSelected = organization.id === selectedOrgId;

            return (
              <button
                key={organization.id}
                type="button"
                onClick={() => onSelectOrganization(organization.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors",
                  isSelected ? "bg-zinc-900 text-zinc-50" : "hover:bg-zinc-100",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md text-xs font-semibold",
                      isSelected
                        ? "bg-zinc-700 text-zinc-50"
                        : "bg-zinc-200 text-zinc-700",
                    )}
                  >
                    {organization.slug.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">
                      {organization.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        isSelected ? "text-zinc-300" : "text-zinc-500",
                      )}
                    >
                      {organization.role}
                    </span>
                  </span>
                </span>

                {isSelected ? <Check className="size-4" /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-2 border-t border-zinc-200 px-2 pb-1 pt-2">
          <div className="mb-1 flex items-center gap-1.5">
            <MailPlus className="size-3.5 text-zinc-500" />
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Enviar convite
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="email@dominio.com"
              className="h-7 text-xs"
              maxLength={256}
            />
            <Button
              type="button"
              className="h-7 gap-1 px-2 text-xs"
              onClick={handleCreateInvite}
              disabled={isCreatingInvite}
            >
              {isCreatingInvite ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <MailPlus className="size-3.5" />
              )}
              Enviar
            </Button>
          </div>
        </div>

        {shouldShowPendingInvites ? (
          <div className="mt-2 border-t border-zinc-200 pt-2">
            <div className="px-2 py-1">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Convites pendentes
              </p>
            </div>

            <div className="space-y-1 px-1 pb-1">
              {invites.map((invite) => {
                const isHandlingCurrentInvite = handlingInviteId === invite.id;

                return (
                  <div
                    key={invite.id}
                    className="rounded-md border border-zinc-200 p-2"
                  >
                    <p className="text-sm font-medium text-zinc-900">
                      {invite.organization.name}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Convidado por {invite.invited_by_user.name}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <Button
                        type="button"
                        className="h-7 gap-1.5 px-2 text-xs"
                        onClick={() => handleAcceptInvite(invite)}
                        disabled={
                          isAcceptingInvite ||
                          isRejectingInvite ||
                          isHandlingCurrentInvite
                        }
                      >
                        {isAcceptingInvite && isHandlingCurrentInvite ? (
                          <LoaderCircle className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCheck className="size-3.5" />
                        )}
                        Aceitar
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-7 gap-1.5 px-2 text-xs"
                        onClick={() => handleRejectInvite(invite)}
                        disabled={
                          isAcceptingInvite ||
                          isRejectingInvite ||
                          isHandlingCurrentInvite
                        }
                      >
                        {isRejectingInvite && isHandlingCurrentInvite ? (
                          <LoaderCircle className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                        Recusar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
