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
    <div className="border-t border-zinc-200/80 px-1.5 py-2.5">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full min-w-0 items-center gap-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-zinc-100/80 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-1.5"
            aria-label={`Abrir ações do usuário ${userName}`}
          >
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-200/80 text-[11px] font-semibold text-zinc-700">
              {initials}
            </span>
            <div className="min-w-0 group-data-[collapsed=true]:hidden">
              <p className="truncate text-[11px] font-semibold text-zinc-900">
                {userName}
              </p>
              <p className="truncate text-[10px] text-zinc-500">{userEmail}</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-56 p-0"
        >
          <div className="p-2">
            <p className="truncate px-2 py-1 text-xs font-semibold text-zinc-900">
              {userName}
            </p>
            <p className="truncate px-2 pb-2 text-[11px] text-zinc-500">
              {userEmail}
            </p>
          </div>
          <div className="border-t border-zinc-200/80">
            <Link to="/settings">
              <Button
                variant="ghost"
                className="h-8 w-full justify-start gap-2 rounded-none px-3 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <Settings className="size-4 shrink-0" />
                Minha conta
              </Button>
            </Link>
            <Link to="/organizations/settings">
              <Button
                variant="ghost"
                className="h-8 w-full justify-start gap-2 rounded-none px-3 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <Building2 className="size-4 shrink-0" />
                Organização
              </Button>
            </Link>
            {isLoadingSubscription ? (
              <div className="flex h-8 items-center gap-2 px-3">
                <LoaderCircle className="size-4 animate-spin text-zinc-400" />
                <span className="text-[12px] text-zinc-500">Assinatura...</span>
              </div>
            ) : (
              <Link to="/subscription">
                <Button
                  variant="ghost"
                  className="h-8 w-full justify-start gap-2 rounded-none px-3 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  {hasPaidPlan ? (
                    <CreditCard className="size-4 shrink-0 text-violet-500" />
                  ) : (
                    <Sparkles className="size-4 shrink-0 text-amber-500" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-left">
                    {hasPaidPlan
                      ? `Assinatura ${subscriptionStatus ?? "ativa"}`
                      : "Plano grátis • 5 mapas"}
                  </span>
                </Button>
              </Link>
            )}
          </div>
          <div className="border-t border-zinc-200/80 p-1">
            <Button
              variant="ghost"
              className="h-8 w-full justify-start gap-2 rounded-md px-2 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700"
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
