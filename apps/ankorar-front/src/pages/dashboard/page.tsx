import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDashboardActivity,
  useDashboardAiUsage,
  useDashboardChurn,
  useDashboardMrr,
  useDashboardOpenAiCosts,
  useDashboardOverview,
  useDashboardSubscriptions,
  useDashboardUsersRecent,
} from "@/hooks/useDashboard";
import {
  Area,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Navigate } from "react-router";
import { useUser } from "@/hooks/useUser";
import {
  BarChart2,
  Building2,
  CreditCard,
  DollarSign,
  Map,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Pendente",
  trialing: "Teste",
};

const STATUS_COLOR: Record<string, string> = {
  active: "#10b981",
  trialing: "#8b5cf6",
  past_due: "#f59e0b",
  canceled: "#71717a",
};

function formatMrr(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function formatUsd(value: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="size-10 rounded-xl" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="mt-2 h-3 w-36 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 rounded-2xl">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="mt-1 h-3 w-48 rounded-md" />
            </CardHeader>
            <CardContent className="pt-4">
              <Skeleton className="h-24 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 rounded-2xl">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="mt-1 h-3 w-56 rounded-md" />
            </CardHeader>
            <CardContent className="pt-4">
              <Skeleton className="h-[280px] w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { can } = useUser();

  if (!can("read:saas_dashboard")) {
    return <Navigate to="/home" replace />;
  }

  const overview = useDashboardOverview();
  const usersRecent = useDashboardUsersRecent({ period: "30d", limit: 10 });
  const churn = useDashboardChurn();
  const mrr = useDashboardMrr();
  const subscriptions = useDashboardSubscriptions();
  const aiUsage = useDashboardAiUsage();
  const openAiCosts = useDashboardOpenAiCosts();
  const activity = useDashboardActivity({ period: "30" });

  const loading =
    overview.isLoading ||
    usersRecent.isLoading ||
    churn.isLoading ||
    mrr.isLoading ||
    subscriptions.isLoading ||
    aiUsage.isLoading ||
    openAiCosts.isLoading ||
    activity.isLoading;

  if (loading) {
    return (
      <div className="dashboard-bg -m-4 flex min-h-full min-w-0 flex-col sm:-m-6 lg:-m-7">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent pointer-events-none" aria-hidden />
        <header className="shrink-0 border-b border-border/50 bg-card/80 px-6 py-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" aria-hidden />
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">SaaS</span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">Métricas e indicadores do produto</p>
            </div>
          </div>
        </header>
        <main className="relative min-h-0 flex-1 p-6">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  const o = overview.data;
  const cr = churn.data;
  const mr = mrr.data;
  const sub = subscriptions.data;
  const ai = aiUsage.data;
  const openAi = openAiCosts.data;
  const act = activity.data;
  const recent = usersRecent.data;

  return (
    <div className="dashboard-bg -m-4 flex min-h-full min-w-0 flex-col sm:-m-6 lg:-m-7">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent pointer-events-none" aria-hidden />
      <header className="shrink-0 border-b border-border/50 bg-card/80 px-6 py-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" aria-hidden />
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">SaaS</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Métricas e indicadores para decisão</p>
          </div>
        </div>
      </header>

      <main className="relative min-h-0 flex-1 space-y-10 p-6">
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">Métricas principais</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de usuários</CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Users className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{o?.total_users ?? "—"}</div>
              <p className="mt-1 text-xs text-muted-foreground">+{o?.users_created_last_7d ?? 0} (7d) · +{o?.users_created_last_30d ?? 0} (30d)</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assinaturas ativas</CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-chart-2/20 text-[var(--chart-2)]">
                <CreditCard className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{o?.active_subscriptions ?? "—"}</div>
              <p className="mt-1 text-xs text-muted-foreground">{o?.canceled_subscriptions ?? 0} canceladas</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5 hover:ring-emerald-500/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600">
                <TrendingUp className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight text-emerald-700">{mr ? formatMrr(mr.total_mrr_cents) : "—"}</div>
              <p className="mt-1 text-xs text-muted-foreground">Receita recorrente mensal</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/5 hover:ring-amber-500/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Churn</CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600">
                <TrendingDown className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{cr?.churn_rate != null ? `${cr.churn_rate}%` : "—"}</div>
              <p className="mt-1 text-xs text-muted-foreground">{cr?.canceled_count ?? 0} canceladas</p>
            </CardContent>
          </Card>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" aria-labelledby="secondary-metrics">
          <h2 id="secondary-metrics" className="sr-only">Mapas e organizações</h2>
          <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mapas</CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-chart-4/20 text-[var(--chart-4)]">
                <Map className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{o?.total_maps ?? "—"}</div>
            </CardContent>
          </Card>
          <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organizações</CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-chart-3/20 text-[var(--chart-3)]">
                <Building2 className="size-5" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{o?.total_organizations ?? "—"}</div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4" aria-labelledby="ai-usage-heading">
          <div>
            <h2 id="ai-usage-heading" className="text-lg font-semibold tracking-tight text-foreground">Uso de IA</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Créditos consumidos no período atual (mensal). Média por usuário e por plano para precificação.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/20 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Créditos consumidos (período)</CardTitle>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Sparkles className="size-5" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{ai?.total_credits_consumed_current_period ?? "—"}</div>
                <p className="mt-1 text-xs text-muted-foreground">Total no mês atual</p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Média por usuário</CardTitle>
                <div className="flex size-10 items-center justify-center rounded-xl bg-chart-2/20 text-[var(--chart-2)]">
                  <BarChart2 className="size-5" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                  {ai?.average_credits_per_user != null ? ai.average_credits_per_user.toFixed(1) : "—"}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Usuários com plano IA</p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuários com IA (período)</CardTitle>
                <div className="flex size-10 items-center justify-center rounded-xl bg-chart-4/20 text-[var(--chart-4)]">
                  <Users className="size-5" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{ai?.users_with_ai_in_period ?? "—"}</div>
                <p className="mt-1 text-xs text-muted-foreground">Em período ativo</p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Créditos restantes</CardTitle>
                <div className="flex size-10 items-center justify-center rounded-xl bg-chart-3/20 text-[var(--chart-3)]">
                  <Wallet className="size-5" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{ai?.credits_remaining_total ?? "—"}</div>
                <p className="mt-1 text-xs text-muted-foreground">Soma dos saldos</p>
              </CardContent>
            </Card>
          </div>
          {ai?.by_plan?.length ? (
            <Card className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">Por plano</CardTitle>
                <CardDescription className="text-muted-foreground">Limite mensal, consumido e média por usuário</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium text-foreground">Plano</th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">Usuários</th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">Limite/usuário</th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">Consumido</th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">Média/usuário</th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">Restante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ai.by_plan.map((row) => (
                        <tr key={row.plan_slug} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium capitalize text-foreground">{row.plan_slug}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.users_count}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.limit_per_user}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.total_consumed}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.average_per_user.toFixed(1)}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.credits_remaining_total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        <section className="space-y-4" aria-labelledby="openai-costs-heading">
          <div>
            <h2 id="openai-costs-heading" className="text-lg font-semibold tracking-tight text-foreground">Gastos OpenAI (API)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Custos da organização (últimos 30 dias).
            </p>
          </div>
          {openAi?.error ? (
            <Card className="overflow-hidden border-0 bg-amber-50/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-200/60 dark:bg-amber-950/20 dark:ring-amber-800/40 rounded-2xl">
              <CardContent className="py-4 space-y-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">{openAi.error}</p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Admin Keys:{" "}
                  <a href="https://platform.openai.com/settings/organization/admin-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.openai.com/settings/organization/admin-keys</a>
                  {" "}(conta precisa ser Owner da organização).
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5 hover:ring-emerald-500/20 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total (período)</CardTitle>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600">
                      <DollarSign className="size-5" aria-hidden />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                      {openAi ? formatUsd(openAi.total_amount, openAi.currency) : "—"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{openAi?.buckets_count ?? 0} dias</p>
                  </CardContent>
                </Card>
                <Card className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Média por usuário ativo</CardTitle>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-chart-3/20 text-[var(--chart-3)]">
                      <Users className="size-5" aria-hidden />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                      {openAi && o?.active_subscriptions != null && o.active_subscriptions > 0
                        ? formatUsd(openAi.total_amount / o.active_subscriptions, openAi.currency)
                        : "—"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {o?.active_subscriptions != null && o.active_subscriptions > 0
                        ? `${o.active_subscriptions} assinaturas ativas`
                        : "Sem assinaturas ativas"}
                    </p>
                  </CardContent>
                </Card>
                {openAi?.by_line_item && Object.keys(openAi.by_line_item).length > 0 ? (
                  Object.entries(openAi.by_line_item).slice(0, 3).map(([lineItem, amount]) => (
                    <Card key={lineItem} className="group relative overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground truncate" title={lineItem}>{lineItem}</CardTitle>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-4/20 text-[var(--chart-4)]">
                          <DollarSign className="size-5" aria-hidden />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{formatUsd(amount, openAi.currency)}</div>
                      </CardContent>
                    </Card>
                  ))
                ) : null}
              </div>
              {openAi?.by_day?.length ? (
                <Card className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">Custo por dia</CardTitle>
                    <CardDescription className="text-muted-foreground">Gasto diário (OpenAI)</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={openAi.by_day} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                          stroke="var(--muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={{ stroke: "var(--border)" }}
                        />
                        <YAxis width={32} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          labelFormatter={formatDate}
                          formatter={(value: number) => [formatUsd(value, openAi.currency), "Custo"]}
                          contentStyle={{
                            borderRadius: "var(--radius-lg)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            padding: "12px 16px",
                          }}
                        />
                        <Bar dataKey="amount" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Custo" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : null}
            </>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2" aria-labelledby="charts-heading">
          <h2 id="charts-heading" className="sr-only">Gráficos de atividade e assinaturas</h2>
          <Card className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Atividade (30 dias)</CardTitle>
              <CardDescription className="text-muted-foreground">Novos usuários e mapas por dia</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {act?.by_day?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={act.by_day} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis width={32} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      labelFormatter={formatDate}
                      contentStyle={{
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        padding: "12px 16px",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "8px" }} />
                    <Area
                      type="monotone"
                      dataKey="users_created"
                      name="Usuários"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      fill="url(#colorUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="maps_created"
                      name="Mapas"
                      stroke="var(--chart-2)"
                      strokeWidth={2.5}
                      fill="url(#colorMaps)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 text-center">
                  <span className="text-4xl opacity-50" aria-hidden>📊</span>
                  <p className="text-sm font-medium text-muted-foreground">Sem dados no período</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Assinaturas por status</CardTitle>
              <CardDescription className="text-muted-foreground">Distribuição atual</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {sub?.by_status?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={sub.by_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      strokeWidth={3}
                      stroke="var(--card)"
                      label={({ status, count }) => `${STATUS_LABEL[status] ?? status}: ${count}`}
                    >
                      {sub.by_status.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLOR[entry.status] ?? "#71717a"} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value, "Assinaturas"]}
                      labelFormatter={(label) => STATUS_LABEL[label] ?? label}
                      contentStyle={{
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        padding: "12px 16px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 text-center">
                  <span className="text-4xl opacity-50" aria-hidden>🥧</span>
                  <p className="text-sm font-medium text-muted-foreground">Sem dados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" aria-labelledby="mrr-users-heading">
          <h2 id="mrr-users-heading" className="sr-only">MRR por plano e usuários recentes</h2>
          <Card className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">MRR por plano</CardTitle>
              <CardDescription className="text-muted-foreground">Receita mensal por plano</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {mr?.by_plan?.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={mr.by_plan} layout="vertical" margin={{ top: 8, right: 16, left: 64, bottom: 8 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `R$ ${v / 100}`}
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis type="category" dataKey="plan_name" width={60} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value: number) => [formatMrr(value), "MRR"]}
                      contentStyle={{
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        padding: "12px 16px",
                      }}
                    />
                    <Bar dataKey="mrr_cents" fill="url(#barGradient)" radius={[0, 8, 8, 0]} name="MRR" maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[260px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 text-center">
                  <span className="text-4xl opacity-50" aria-hidden>💰</span>
                  <p className="text-sm font-medium text-muted-foreground">Nenhum plano ativo</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-card/90 shadow-lg shadow-black/5 ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">Usuários recentes</CardTitle>
              <CardDescription className="text-muted-foreground">Últimos 30 dias · {recent?.total ?? 0} no total</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {recent?.users?.length ? (
                <div className="scrollbar max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {recent.users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary" aria-hidden>
                        {(u.name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-medium text-foreground">
                          {new Date(u.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {u.subscription_status ? STATUS_LABEL[u.subscription_status] ?? u.subscription_status : "free"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[260px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 text-center">
                  <span className="text-4xl opacity-50" aria-hidden>👤</span>
                  <p className="text-sm font-medium text-muted-foreground">Nenhum usuário recente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
