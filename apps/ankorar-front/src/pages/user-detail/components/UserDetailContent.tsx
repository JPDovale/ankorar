import { useUser } from "@/hooks/useUser";
import { useUserById } from "@/hooks/useUserById";
import { useUpdateUserSubscription } from "@/hooks/useUpdateUserSubscription";
import { useUpdateUserAiCredits } from "@/hooks/useUpdateUserAiCredits";
import { usePlans } from "@/hooks/useSubscription";
import type { Plan } from "@/services/subscription/listPlansRequest";
import { Navigate, Link, useParams } from "react-router";
import { useState } from "react";
import { ArrowLeft, CreditCard, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserDetailContentSkeleton } from "./UserDetailContentSkeleton";

const SUBSCRIPTION_LABEL: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Pendente",
  trialing: "Teste",
};

function formatDate(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(amount: number): string {
  const value = amount / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInterval(interval: string): string {
  const map: Record<string, string> = {
    month: "mês",
    year: "ano",
    monthly: "mês",
    yearly: "ano",
  };
  return map[interval?.toLowerCase()] ?? interval;
}

function isNeverExpire(resetAt: string | null): boolean {
  if (!resetAt) return false;
  return new Date(resetAt).getUTCFullYear() >= 9999;
}

export function UserDetailContent() {
  const { can } = useUser();
  const { user_id } = useParams<{ user_id: string }>();
  const { data: user, isLoading, isError } = useUserById(user_id);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [aiCreditsDialogOpen, setAiCreditsDialogOpen] = useState(false);
  const [aiCreditsInput, setAiCreditsInput] = useState(0);
  const [neverExpireInput, setNeverExpireInput] = useState(false);
  const { data: plans, isLoading: plansLoading } = usePlans();
  const updateSubscription = useUpdateUserSubscription(user?.id);
  const updateAiCredits = useUpdateUserAiCredits(user?.id);

  const paidPlans = [...(plans ?? [])].sort(
    (a: Plan, b: Plan) => a.amount - b.amount,
  );

  if (!can("read:user:other")) {
    return <Navigate to="/home" replace />;
  }

  if (isError || (user_id && !isLoading && !user)) {
    return (
      <section className="space-y-6">
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Voltar à listagem
        </Link>
        <div
          className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-6 py-8 text-center"
          role="alert"
        >
          <p className="text-sm font-medium text-amber-800">
            Usuário não encontrado ou erro ao carregar.
          </p>
          <p className="mt-1 text-xs text-amber-700">
            O usuário pode não existir ou você não tem permissão.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading || !user) {
    return <UserDetailContentSkeleton />;
  }

  const subscriptionLabel =
    SUBSCRIPTION_LABEL[user.subscription_status ?? ""] ??
    user.subscription_status ??
    "—";

  function openSubscriptionDialog() {
    setSelectedPriceId(user!.stripe_price_id ?? null);
    setSubscriptionDialogOpen(true);
  }

  function handleConfirmSubscription() {
    updateSubscription.mutate(selectedPriceId, {
      onSuccess: () => setSubscriptionDialogOpen(false),
    });
  }

  function openAiCreditsDialog() {
    setAiCreditsInput(user!.ai_credits);
    setNeverExpireInput(isNeverExpire(user!.ai_credits_reset_at));
    setAiCreditsDialogOpen(true);
  }

  function handleConfirmAiCredits() {
    updateAiCredits.mutate(
      { ai_credits: Math.max(0, Math.floor(aiCreditsInput)), never_expire: neverExpireInput },
      { onSuccess: () => setAiCreditsDialogOpen(false) },
    );
  }

  return (
    <section className="space-y-6">
      <Link
        to="/users"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
      >
        <ArrowLeft className="size-4" />
        Voltar à listagem
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            {user.name}
          </h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
      </header>

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] overflow-hidden">
        <dl className="divide-y divide-zinc-100">
          <div className="px-6 py-4">
            <dt className="text-xs font-medium text-zinc-500">ID</dt>
            <dd className="mt-1 text-sm font-mono text-zinc-900">{user.id}</dd>
          </div>
          <div className="px-6 py-4">
            <dt className="text-xs font-medium text-zinc-500">E-mail</dt>
            <dd className="mt-1 text-sm text-zinc-900">{user.email}</dd>
          </div>
          <div className="px-6 py-4">
            <dt className="text-xs font-medium text-zinc-500">Criado em</dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {formatDate(user.created_at)}
            </dd>
          </div>
          <div className="px-6 py-4">
            <dt className="text-xs font-medium text-zinc-500">
              Status da assinatura
            </dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium data-[subscription=active]:bg-emerald-500/15 data-[subscription=active]:text-emerald-800 data-[subscription=trialing]:bg-violet-500/15 data-[subscription=trialing]:text-violet-800 data-[subscription=past_due]:bg-amber-500/15 data-[subscription=past_due]:text-amber-800 data-[subscription=canceled]:bg-zinc-500/15 data-[subscription=canceled]:text-zinc-700 data-[subscription=none]:bg-zinc-100 data-[subscription=none]:text-zinc-600"
                data-subscription={user.subscription_status ?? "none"}
              >
                {subscriptionLabel}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={openSubscriptionDialog}
              >
                <CreditCard className="size-3.5" />
                Criar/editar assinatura
              </Button>
            </dd>
          </div>
          {user.stripe_customer_id && (
            <div className="px-6 py-4">
              <dt className="text-xs font-medium text-zinc-500">
                Stripe Customer ID
              </dt>
              <dd className="mt-1 text-sm font-mono text-zinc-700 break-all">
                {user.stripe_customer_id}
              </dd>
            </div>
          )}
          <div className="px-6 py-4">
            <dt className="text-xs font-medium text-zinc-500">Créditos de IA</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-900">{user.ai_credits}</span>
              {user.ai_credits_reset_at ? (
                isNeverExpire(user.ai_credits_reset_at) ? (
                  <span className="text-xs text-zinc-500">Não expira</span>
                ) : (
                  <span className="text-xs text-zinc-500">
                    Reset em {formatDate(user.ai_credits_reset_at)}
                  </span>
                )
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={openAiCreditsDialog}
              >
                <Sparkles className="size-3.5" />
                Editar créditos de IA
              </Button>
            </dd>
          </div>
        </dl>
      </div>

      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura manual</DialogTitle>
            <DialogDescription>
              Assinaturas manuais não expiram. Selecione um plano ou remova a
              assinatura (grátis).
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto space-y-1.5 py-1">
            <button
              type="button"
              onClick={() => setSelectedPriceId(null)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                selectedPriceId === null
                  ? "border-violet-500 bg-violet-500/10 text-violet-800"
                  : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
              }`}
            >
              <span className="font-medium">Sem assinatura (grátis)</span>
              <p className="mt-0.5 text-zinc-500">Limites do plano grátis</p>
            </button>
            {plansLoading ? (
              <div className="flex items-center justify-center py-6 text-zinc-500">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : (
              paidPlans.map((plan) => (
                <button
                  key={plan.price_id}
                  type="button"
                  onClick={() => setSelectedPriceId(plan.price_id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    selectedPriceId === plan.price_id
                      ? "border-violet-500 bg-violet-500/10 text-violet-800"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
                  }`}
                >
                  <span className="font-medium">{plan.name}</span>
                  <p className="mt-0.5 text-zinc-600">
                    {formatPrice(plan.amount)} / {formatInterval(plan.interval)}
                  </p>
                </button>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubscriptionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubscription}
              disabled={updateSubscription.isPending}
            >
              {updateSubscription.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={aiCreditsDialogOpen} onOpenChange={setAiCreditsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créditos de IA</DialogTitle>
            <DialogDescription>
              Defina o saldo de créditos e se eles expiram ou não.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ai-credits">Quantidade</Label>
              <Input
                id="ai-credits"
                type="number"
                min={0}
                value={aiCreditsInput}
                onChange={(e) =>
                  setAiCreditsInput(Number(e.target.value) || 0)
                }
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={neverExpireInput}
                onChange={(e) => setNeverExpireInput(e.target.checked)}
                className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm font-medium">Não expirar</span>
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAiCreditsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAiCredits}
              disabled={updateAiCredits.isPending}
            >
              {updateAiCredits.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
