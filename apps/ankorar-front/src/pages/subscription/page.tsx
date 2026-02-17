import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCurrentSubscription,
  useCreateCustomerPortalSession,
  usePlans,
} from "@/hooks/useSubscription";
import { Link } from "react-router";
import {
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CreditCard,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Pagamento pendente",
  trialing: "Período de teste",
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  trialing: "bg-violet-500/15 text-violet-700 border-violet-200",
  past_due: "bg-amber-500/15 text-amber-700 border-amber-200",
  canceled: "bg-zinc-200 text-zinc-600 border-zinc-200",
};

function SubscriptionPageSkeleton() {
  return (
    <section className="mx-auto max-w-2xl space-y-10 px-4 py-12 sm:px-6">
      <header className="space-y-3 text-center">
        <div className="mx-auto h-9 w-56 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mx-auto h-5 w-80 animate-pulse rounded bg-zinc-100" />
      </header>
      <Card className="overflow-hidden border-0 bg-zinc-50/80 shadow-lg animate-pulse">
        <CardHeader>
          <div className="h-6 w-36 rounded bg-zinc-200" />
          <div className="h-4 w-48 rounded bg-zinc-100" />
        </CardHeader>
        <CardFooter>
          <div className="h-10 w-40 rounded-lg bg-zinc-200" />
        </CardFooter>
      </Card>
    </section>
  );
}

export function SubscriptionPage() {
  const { data: subscription, isLoading } = useCurrentSubscription();
  const { data: plans } = usePlans();
  const createPortal = useCreateCustomerPortalSession();

  if (isLoading) {
    return <SubscriptionPageSkeleton />;
  }

  const hasSubscription =
    subscription?.subscription_status || subscription?.stripe_price_id;
  const status = subscription?.subscription_status ?? null;
  const statusStyle = status ? STATUS_STYLE[status] ?? STATUS_STYLE.canceled : STATUS_STYLE.canceled;
  const nextBilling = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const activePlanName =
    subscription?.stripe_price_id && plans?.length
      ? plans.find((p) => p.price_id === subscription.stripe_price_id)?.name ?? null
      : null;

  return (
    <section className="mx-auto max-w-2xl space-y-10 px-4 py-12 sm:px-6">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Sua assinatura, seu controle
        </h1>
        <p className="text-base text-zinc-600 sm:text-lg">
          {hasSubscription
            ? "Você tem acesso a tudo. Gerencie pagamentos e renovação quando quiser."
            : "Desbloqueie todo o potencial da plataforma com um plano que cabe no seu ritmo."}
        </p>
      </header>

      {hasSubscription ? (
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-zinc-50 to-white shadow-xl ring-1 ring-zinc-200/80">
          <div className="border-b border-zinc-200/80 bg-white/60 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-zinc-900">
                    {activePlanName ?? "Plano ativo"}
                  </CardTitle>
                  <CardDescription className="text-zinc-600">
                    {activePlanName
                      ? "Você está aproveitando todos os benefícios deste plano."
                      : "Você está aproveitando todos os benefícios"}
                  </CardDescription>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyle}`}
              >
                {status ? STATUS_LABEL[status] ?? status : "—"}
              </span>
            </div>
          </div>
          <CardContent className="space-y-6 px-6 py-6">
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-center gap-3 rounded-lg bg-white/80 p-3 text-sm text-zinc-700">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                <span>Acesso completo a mapas e bibliotecas</span>
              </li>
              <li className="flex items-center gap-3 rounded-lg bg-white/80 p-3 text-sm text-zinc-700">
                <Zap className="size-5 shrink-0 text-violet-500" />
                <span>Recursos premium sem limite</span>
              </li>
              <li className="flex items-center gap-3 rounded-lg bg-white/80 p-3 text-sm text-zinc-700">
                <ShieldCheck className="size-5 shrink-0 text-violet-500" />
                <span>Pagamento seguro e renovação automática</span>
              </li>
              <li className="flex items-center gap-3 rounded-lg bg-white/80 p-3 text-sm text-zinc-700">
                <Sparkles className="size-5 shrink-0 text-violet-500" />
                <span>Novidades liberadas para você primeiro</span>
              </li>
            </ul>
            {nextBilling && (
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-white/60 px-4 py-3 text-sm text-zinc-600">
                <Calendar className="size-4 shrink-0 text-zinc-500" />
                <span>
                  Próxima cobrança: <strong className="text-zinc-800">{nextBilling}</strong>
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-zinc-200/80 bg-white/40 px-6 py-4">
            <Button
              size="lg"
              className="gap-2 font-medium shadow-sm"
              disabled={createPortal.isPending}
              onClick={() => createPortal.mutate()}
            >
              {createPortal.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Gerenciar assinatura
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
            <p className="ml-4 text-xs text-zinc-500">
              Alterar cartão, ver faturas ou cancelar quando quiser.
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-50/80 to-white shadow-xl ring-1 ring-violet-200/50">
          <div className="border-b border-violet-200/50 bg-white/70 px-6 py-6 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600">
              <Sparkles className="size-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-900">
              Eleve seu uso com um plano
            </CardTitle>
            <CardDescription className="mt-2 max-w-md mx-auto text-base text-zinc-600">
              Milhares de usuários já desbloquearam mapas ilimitados, bibliotecas
              organizadas e suporte prioritário. Comece em minutos.
            </CardDescription>
          </div>
          <CardContent className="space-y-4 px-6 py-6">
            <ul className="space-y-3 text-sm text-zinc-700">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                Mapas e camadas sem limite — crie e compartilhe à vontade
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                Bibliotecas para organizar projetos e equipes
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                Cobrança segura; cancele quando quiser, sem burocracia
              </li>
            </ul>
          </CardContent>
          <CardFooter className="border-t border-violet-200/50 bg-white/50 px-6 py-5">
            <Link to="/pricing" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 font-medium shadow-md sm:w-auto">
                Ver planos e preços
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <p className="ml-4 hidden text-xs text-zinc-500 sm:block">
              Planos a partir de poucos reais por mês. Sem compromisso.
            </p>
          </CardFooter>
        </Card>
      )}
    </section>
  );
}
