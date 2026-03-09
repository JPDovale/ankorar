import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import {
  usePlans,
  useCurrentSubscription,
  useCreateCheckoutSession,
} from "@/hooks/useSubscription";
import type { Plan } from "@/services/subscription/listPlansRequest";
import { Link, useNavigate } from "react-router";
import {
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  HelpCircle,
  BadgeCheck,
  UserCheck,
  Star,
  Quote,
} from "lucide-react";

const FREE_PLAN = {
  name: "Grátis",
  features: [
    "5 mapas mentais",
    "Acesso à plataforma",
    "Crie e edite seus mapas",
    "Participar de 2 Organizações",
  ],
} as const;

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

const TRUST_BADGES = [
  { icon: Lock, text: "Pagamento 100% seguro" },
  { icon: BadgeCheck, text: "Cancele quando quiser" },
  { icon: ShieldCheck, text: "Dados protegidos" },
];

/** Mocks de prova social para conversão */
const SOCIAL_PROOF_STATS = [
  { value: "500+", label: "usuários ativos" },
  { value: "12k+", label: "mapas criados" },
  { value: "4,9", label: "avaliação média" },
  { value: "98%", label: "recomendariam" },
];

const TESTIMONIALS = [
  {
    name: "Marina Costa",
    role: "Product Manager",
    quote:
      "Organizei todos os projetos da equipe em bibliotecas. O tempo que eu perdia procurando mapa sumiu. Recomendo demais.",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Ricardo Mendes",
    role: "Consultor e mentor",
    quote:
      "Uso para mapas de mentoria e workshops. Interface limpa, sem enrolação. Meus clientes adoram os mapas que compartilho.",
    rating: 5,
    initials: "RM",
  },
  {
    name: "Fernanda Lima",
    role: "Estudante de pós-graduação",
    quote:
      "Mapas mentais me ajudaram a passar na dissertação. Consegui visualizar toda a estrutura do trabalho. Vale cada centavo do plano.",
    rating: 5,
    initials: "FL",
  },
];

const BENEFITS = [
  {
    icon: MapPin,
    title: "Mapas ilimitados",
    description: "Crie e edite quantos mapas precisar. Sem limite de camadas nem de projetos.",
  },
  {
    icon: Zap,
    title: "Recursos premium",
    description: "Acesso a ferramentas avançadas e atualizações antes de todo mundo.",
  },
  {
    icon: Users,
    title: "Feito para equipes",
    description: "Organize em bibliotecas, compartilhe com sua equipe e escale sem complicação.",
  },
];

const FAQ_ITEMS = [
  {
    pergunta: "E se eu não gostar?",
    resposta:
      "Você pode cancelar a qualquer momento em um clique. Sem multa, sem burocracia. Seu acesso continua até o fim do período já pago. Priorizamos sua tranquilidade.",
  },
  {
    pergunta: "Posso cancelar a qualquer momento?",
    resposta:
      "Sim. Você pode cancelar pelo painel da assinatura quando quiser. Não há fidelidade nem multa. O acesso continua até o fim do período já pago.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "O pagamento é feito por cartão de crédito de forma segura (Stripe). A cobrança é recorrente no intervalo do seu plano (mensal ou anual). Você recebe a fatura por e-mail.",
  },
  {
    pergunta: "E se eu já tiver assinatura?",
    resposta:
      "Se você já é assinante, faça login e acesse \"Assinatura\" no menu para gerenciar seu plano, trocar cartão ou alterar entre mensal e anual.",
  },
];

/** Use cases para ancoragem de valor (conversão) */
const USE_CASES = [
  "Estudos e pesquisa",
  "Planejamento de projetos",
  "Equipes e organizações",
  "Mentoria e workshops",
];

function PricingPageSkeleton() {
  return (
    <div className="min-h-screen bg-ds-surface">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="mx-auto h-10 w-72 animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700" />
          <div className="mx-auto h-5 w-96 animate-pulse rounded bg-navy-100 dark:bg-navy-800" />
        </div>
        <div className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-32 animate-pulse rounded-full bg-navy-100 dark:bg-navy-800" />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-navy-200/50 bg-ds-surface-elevated p-5 dark:border-navy-700/60 dark:bg-navy-900">
              <div className="h-5 w-24 rounded bg-navy-200 dark:bg-navy-700" />
              <div className="mt-3 h-7 w-28 rounded bg-navy-100 dark:bg-navy-800" />
              <div className="mt-4 space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-3.5 w-full rounded bg-navy-100 dark:bg-navy-800" />
                ))}
              </div>
              <div className="mt-5 h-9 w-full rounded-md bg-navy-200 dark:bg-navy-700" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PricingCard({
  plan,
  isPopular,
  isCurrentPlan,
  formatPriceFn,
  onSelect,
  isPending,
}: {
  plan: Plan;
  isPopular: boolean;
  isCurrentPlan: boolean;
  formatPriceFn: (n: number) => string;
  onSelect: () => void;
  isPending: boolean;
}) {
  const intervalLabel = formatInterval(plan.interval);
  const showPopular = isPopular && !isCurrentPlan;

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg",
        isCurrentPlan
          ? "border-ds-success/30 bg-gradient-to-b from-ds-success/5 to-ds-surface-elevated ring-2 ring-ds-success/40 shadow-lg dark:from-emerald-400/8 dark:to-navy-900 dark:border-emerald-500/40"
          : isPopular
            ? "border-amber-400/40 bg-gradient-to-b from-amber-50/80 to-ds-surface-elevated ring-2 ring-amber-400/40 shadow-lg scale-[1.02] sm:scale-105 dark:from-amber-400/12 dark:to-navy-900 dark:border-amber-500/40"
            : "border-navy-200/50 bg-ds-surface-elevated shadow-sm hover:border-navy-300/60 dark:border-navy-700/60 dark:bg-navy-900 dark:hover:border-navy-600"
      )}
    >
      {isCurrentPlan && (
        <div className="absolute inset-x-0 top-0 bg-ds-success py-1 text-center text-[11px] font-semibold text-white dark:bg-emerald-500 dark:text-navy-950">
          Seu plano
        </div>
      )}
      {showPopular && (
        <div className="absolute inset-x-0 top-0 bg-amber-500 py-1 text-center text-[11px] font-semibold text-navy-950 dark:bg-amber-400">
          Mais popular
        </div>
      )}

      <div className={isCurrentPlan || isPopular ? "pt-5" : ""}>
        <div className="text-sm font-bold text-navy-900 dark:text-ds-white">{plan.name}</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-navy-900 dark:text-ds-white">
            {formatPriceFn(plan.amount)}
          </span>
          <span className="text-xs text-text-muted">/{intervalLabel}</span>
        </div>
      </div>

      <ul className="mt-4 flex-1 space-y-1.5">
        {(plan.features ?? []).map((feature, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-navy-800 dark:text-navy-100">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ds-success" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {isCurrentPlan ? (
          <Button size="sm" variant="outline" className="w-full gap-1.5" asChild>
            <Link to="/subscription">
              Gerenciar assinatura
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              className="w-full gap-1.5"
              disabled={isPending}
              onClick={onSelect}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  Começar agora
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
            {isPopular && (
              <p className="mt-1.5 text-center text-[10px] text-text-muted">
                Cancele quando quiser • Pagamento seguro
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FreePlanCard({ isCurrentPlan = true }: { isCurrentPlan?: boolean }) {
  return (
    <div className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-navy-200/50 bg-ds-surface-elevated p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-navy-700/60 dark:bg-navy-900">
      {isCurrentPlan && (
        <div className="absolute inset-x-0 top-0 bg-navy-800 py-1 text-center text-[11px] font-semibold text-white dark:bg-navy-700">
          Seu plano atual
        </div>
      )}

      <div className={isCurrentPlan ? "pt-5" : ""}>
        <div className="text-sm font-bold text-navy-900 dark:text-ds-white">{FREE_PLAN.name}</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-navy-900 dark:text-ds-white">R$ 0</span>
          <span className="text-xs text-text-muted">/sempre</span>
        </div>
      </div>

      <ul className="mt-4 flex-1 space-y-1.5">
        {FREE_PLAN.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-navy-800 dark:text-navy-100">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ds-success" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Button size="sm" variant="outline" className="w-full gap-1.5" asChild>
          <Link to="/register">
            <UserCheck className="size-3.5" />
            Começar grátis
          </Link>
        </Button>
        <p className="mt-1.5 text-center text-[10px] text-text-muted">
          Sem cartão de crédito
        </p>
      </div>
    </div>
  );
}

export function PricingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: plans, isLoading, isError } = usePlans();
  const { data: subscription } = useCurrentSubscription();
  const createCheckout = useCreateCheckoutSession();

  const currentPriceId = subscription?.stripe_price_id ?? null;
  const isFreeCurrentPlan = !currentPriceId;

  function handleSelectPlan(priceId: string) {
    if (!user) {
      navigate("/login");
      return;
    }
    createCheckout.mutate(priceId);
  }

  if (isLoading) {
    return <PricingPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-navy-100 text-text-muted">
          <HelpCircle className="size-8" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-navy-900 dark:text-ds-white">
          Planos temporariamente indisponíveis
        </h2>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          Estamos preparando novidades. Tente novamente em alguns minutos ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  const paidPlans = [...(plans ?? [])].sort((a, b) => a.amount - b.amount);
  const popularIndex = paidPlans.length >= 2 ? 1 : -1;

  return (
    <div className="min-h-screen bg-ds-surface">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-500/35 dark:bg-amber-400/10 dark:text-amber-200">
            <Sparkles className="size-4" />
            Planos que cabem no seu ritmo
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy-900 dark:text-ds-white sm:text-5xl lg:text-6xl">
            Invista no que{" "}
            <span className="text-amber-600 dark:text-amber-400">realmente importa</span>
          </h1>
          <p className="mt-4 text-base font-medium text-text-muted sm:text-lg">
            Para criadores, estudantes e equipes que querem organizar ideias e tomar decisões melhores.
          </p>
          <p className="mt-3 text-lg text-text-secondary sm:text-xl">
            Mapas ilimitados, bibliotecas organizadas e suporte quando precisar.
            Comece em menos de 2 minutos — sem cartão no plano grátis.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-4">
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary"
            >
              <Icon className="size-5 text-amber-500 dark:text-amber-300" />
              {text}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-6 border-t border-navy-200/60 pt-10 dark:border-navy-700/60">
          {SOCIAL_PROOF_STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-navy-900 dark:text-ds-white sm:text-3xl">
                {value}
              </div>
              <div className="mt-0.5 text-sm text-text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="border-y border-navy-200/60 bg-ds-surface-elevated py-12 sm:py-16 dark:border-navy-700/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900 dark:text-ds-white sm:text-3xl">
            Quem já usa recomenda
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
            Criadores, estudantes e equipes que já organizam ideias com a Ankorar.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl border border-navy-200/60 bg-ds-surface p-6 shadow-sm dark:border-navy-700/60 dark:bg-navy-900"
              >
                <Quote className="absolute right-4 top-4 size-8 text-amber-200 dark:text-amber-300/20" />
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-navy-800 dark:text-navy-100">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-semibold text-amber-700 dark:text-amber-300">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-navy-900 dark:text-ds-white">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-y border-navy-200/60 bg-ds-surface-elevated/80 py-12 sm:py-16 dark:border-navy-700/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900 dark:text-ds-white sm:text-3xl">
            O que você ganha em qualquer plano
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-secondary">
            Recursos pensados para quem quer criar mais e perder menos tempo.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-navy-200/60 bg-ds-surface-elevated p-6 shadow-sm transition-shadow hover:shadow-md dark:border-navy-700/60 dark:bg-navy-900"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-semibold text-navy-900 dark:text-ds-white">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section
        id="pricing-cards"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20"
      >
        <h2 className="text-center text-2xl font-bold text-navy-900 dark:text-ds-white sm:text-3xl">
          Escolha seu plano
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
          Comece grátis com 5 mapas ou escolha um plano pago para desbloquear tudo.
        </p>
        <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2 font-medium text-amber-700 dark:text-amber-300">
            <Users className="size-4" />
            +200 assinaturas nos últimos 30 dias
          </span>
          <span className="text-text-muted">•</span>
          <span className="text-text-secondary">Planos pagos: menos que um café por dia</span>
        </div>
        <div className="mx-auto mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {USE_CASES.map((useCase) => (
            <span
              key={useCase}
              className="rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-200"
            >
              {useCase}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-7xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <FreePlanCard isCurrentPlan={isFreeCurrentPlan} />
          {paidPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={index === popularIndex}
              isCurrentPlan={plan.price_id === currentPriceId}
              formatPriceFn={formatPrice}
              onSelect={() => handleSelectPlan(plan.price_id)}
              isPending={createCheckout.isPending}
            />
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-navy-200/60 bg-ds-surface-elevated px-4 py-3 text-center shadow-sm dark:border-navy-700/60 dark:bg-navy-900">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-navy-800 dark:text-navy-100">98% dos usuários</span>
            {" "}recomendariam a Ankorar para organizar mapas e ideias.
          </p>
        </div>
      </section>

      {/* Garantia / Objeções */}
      <section className="border-t border-navy-200/60 bg-ds-surface-elevated/80 py-12 sm:py-16 dark:border-navy-700/60">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-ds-success/15 text-ds-success">
            <ShieldCheck className="size-7" />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ds-success/30 bg-ds-success/10 px-4 py-1.5 text-sm font-semibold text-ds-success">
            <ShieldCheck className="size-4" />
            Experimente sem risco — cancele em 1 clique
          </div>
          <h2 className="mt-5 text-2xl font-bold text-navy-900 dark:text-ds-white">
            Sem surpresas, sem fidelidade
          </h2>
          <p className="mt-3 text-text-secondary">
            Cancele quando quiser pelo painel da assinatura. Seu acesso continua até o fim do período pago.
            Dúvidas? Nosso suporte responde em português.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-navy-900 dark:text-ds-white">
          Perguntas frequentes
        </h2>
        <ul className="mt-10 space-y-8">
          {FAQ_ITEMS.map(({ pergunta, resposta }) => (
            <li key={pergunta}>
              <h3 className="font-semibold text-navy-900 dark:text-ds-white">{pergunta}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {resposta}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA final */}
      <section className="border-t border-navy-200/60 bg-gradient-to-br from-navy-800 to-navy-900 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Pronto para criar sem limites?
          </h2>
          <p className="mt-3 text-navy-200">
            Escolha um plano acima e comece em menos de 2 minutos. Sem fidelidade — junte-se a centenas de criadores este mês.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-navy-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              Cancele quando quiser
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="size-4" />
              Pagamento seguro
            </span>
          </div>
          <div className="mt-8">
            <a
              href="#pricing-cards"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-navy-950 shadow-lg transition hover:bg-amber-300"
            >
              Ver planos
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
