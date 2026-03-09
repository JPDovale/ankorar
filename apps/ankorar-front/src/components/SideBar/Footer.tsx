import { Can } from "@/components/auth/Can";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentSubscription } from "@/hooks/useSubscription";
import { useUser } from "@/hooks/useUser";
import { getUserInitials } from "@/utils/getUserInitials";
import {
  Building2,
  CreditCard,
  LoaderCircle,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  trialing: "Teste",
  past_due: "Pendente",
  canceled: "Cancelada",
};

export function SideBarFooter() {
  const { user, logout, isLoggingOut } = useUser();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useCurrentSubscription();
  const userName = user?.name || "Usuário";
  const userEmail = user?.email || "sem-email";
  const initials = getUserInitials(userName);

  const hasPaidPlan =
    subscription?.stripe_price_id && subscription?.subscription_status;
  const subscriptionStatus = subscription?.subscription_status
    ? SUBSCRIPTION_STATUS_LABEL[subscription.subscription_status] ??
      subscription.subscription_status
    : null;

  async function handleLogout() {
    const { success } = await logout();

    if (!success) {
      return;
    }

    toast.success("Sessão encerrada.");
  }

  return (
    <div className="border-t border-navy-200/40 px-1.5 py-2.5 dark:border-navy-700/50">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full min-w-0 items-center gap-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-navy-100/60 dark:hover:bg-navy-800/60 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-1.5"
            aria-label={`Abrir ações do usuário ${userName}`}
          >
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-400/20 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              {initials}
            </span>
            <div className="min-w-0 group-data-[collapsed=true]:hidden">
              <p className="truncate text-[11px] font-semibold text-navy-900 dark:text-ds-white">
                {userName}
              </p>
              <p className="truncate text-[10px] text-text-muted">{userEmail}</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="end"
          sideOffset={8}
          className="w-56 p-0 border-navy-200/50 bg-ds-surface-elevated dark:border-navy-700/60 dark:bg-navy-900"
        >
          <div className="p-2">
            <p className="truncate px-2 py-1 text-xs font-semibold text-navy-900 dark:text-ds-white">
              {userName}
            </p>
            <p className="truncate px-2 pb-2 text-[11px] text-text-muted">
              {userEmail}
            </p>
          </div>
          <div className="border-t border-navy-200/40 dark:border-navy-700/60">
            <Link to="/settings">
              <Button
                variant="ghost"
                className="h-8 w-full justify-start gap-2 rounded-none px-3 text-[13px] font-medium text-navy-800 hover:bg-navy-100/80 dark:text-navy-100 dark:hover:bg-navy-800/70"
              >
                <Settings className="size-4 shrink-0" />
                Minha conta
              </Button>
            </Link>
            <Can feature="read:organization">
              <Link to="/organizations/settings">
                <Button
                  variant="ghost"
                  className="h-8 w-full justify-start gap-2 rounded-none px-3 text-[13px] font-medium text-navy-800 hover:bg-navy-100/80 dark:text-navy-100 dark:hover:bg-navy-800/70"
                >
                  <Building2 className="size-4 shrink-0" />
                  Organização
                </Button>
              </Link>
            </Can>
            {isLoadingSubscription ? (
              <div className="flex h-8 items-center gap-2 px-3">
                <LoaderCircle className="size-4 animate-spin text-text-muted" />
                <span className="text-[12px] text-text-muted">Assinatura...</span>
              </div>
            ) : (
              <Can feature="read:subscription">
                <Link to="/subscription">
                  <Button
                    variant="ghost"
                    className="h-8 w-full justify-start gap-2 rounded-none px-3 text-[13px] font-medium text-navy-800 hover:bg-navy-100/80 dark:text-navy-100 dark:hover:bg-navy-800/70"
                  >
                    {hasPaidPlan ? (
                      <CreditCard className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Sparkles className="size-4 shrink-0 text-amber-500 dark:text-amber-300" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-left">
                      {hasPaidPlan
                        ? `Assinatura ${subscriptionStatus ?? "ativa"}`
                        : "Plano grátis • 5 mapas"}
                    </span>
                  </Button>
                </Link>
              </Can>
            )}
          </div>
          <div className="border-t border-navy-200/40 p-1 dark:border-navy-700/60">
            <Button
              variant="ghost"
              className="h-8 w-full justify-start gap-2 rounded-md px-2 text-[13px] text-ds-danger hover:bg-ds-danger/10 hover:text-ds-danger"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <LoaderCircle className="size-4 shrink-0 animate-spin" />
              ) : (
                <LogOut className="size-4 shrink-0" />
              )}
              Sair
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
