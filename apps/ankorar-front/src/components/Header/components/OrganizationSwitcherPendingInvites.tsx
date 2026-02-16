import { Button } from "@/components/ui/button";
import type { OrganizationInvitePreview } from "@/services/organizations/listOrganizationInvitesRequest";
import { CheckCheck, LoaderCircle, X } from "lucide-react";

interface OrganizationSwitcherPendingInvitesProps {
  invites: OrganizationInvitePreview[];
  handlingInviteId: string | null;
  isAcceptingInvite: boolean;
  isRejectingInvite: boolean;
  onAcceptInvite: (invite: OrganizationInvitePreview) => void;
  onRejectInvite: (invite: OrganizationInvitePreview) => void;
}

export function OrganizationSwitcherPendingInvites({
  invites,
  handlingInviteId,
  isAcceptingInvite,
  isRejectingInvite,
  onAcceptInvite,
  onRejectInvite,
}: OrganizationSwitcherPendingInvitesProps) {
  return (
    <div className="border-t border-zinc-200 px-2 py-2">
      <div className="px-1.5 pb-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
          Convites pendentes
        </p>
      </div>

      <div className="space-y-1">
        {invites.map((invite) => {
          const isHandlingCurrentInvite = handlingInviteId === invite.id;
          const isInviteActionDisabled =
            isAcceptingInvite || isRejectingInvite || isHandlingCurrentInvite;
          const showAcceptInviteLoader =
            isAcceptingInvite && isHandlingCurrentInvite;
          const showRejectInviteLoader =
            isRejectingInvite && isHandlingCurrentInvite;

          return (
            <div
              key={invite.id}
              className="flex items-center justify-between gap-2 rounded-md bg-zinc-50 px-2 py-1.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {invite.organization.name}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  Convidado por {invite.invited_by_user.name}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  className="h-7 gap-1 px-2 text-[11px]"
                  onClick={() => onAcceptInvite(invite)}
                  disabled={isInviteActionDisabled}
                >
                  {showAcceptInviteLoader ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="size-3.5" />
                  )}
                  Aceitar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-7 gap-1 px-2 text-[11px]"
                  onClick={() => onRejectInvite(invite)}
                  disabled={isInviteActionDisabled}
                >
                  {showRejectInviteLoader ? (
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
  );
}
