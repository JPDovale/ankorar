import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  usePlans,
  useCurrentSubscription,
  useCreateCheckoutSession,
} from "@/hooks/useSubscription";
import type { Plan } from "@/services/subscription/listPlansRequest";
import { Link } from "react-router";
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="mx-auto h-10 w-72 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mx-auto h-5 w-96 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <CardHeader>
                <div className="h-6 w-24 rounded bg-zinc-200" />
                <div className="h-8 w-20 rounded bg-zinc-100" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 w-full rounded bg-zinc-100" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-10 w-full rounded-lg bg-zinc-200" />
              </CardFooter>
            </Card>
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
    <Card
      className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isCurrentPlan
          ? "border-emerald-300 bg-gradient-to-b from-emerald-50/80 to-white ring-2 ring-emerald-400/50 shadow-lg"
          : isPopular
            ? "border-violet-300 bg-gradient-to-b from-violet-50/80 to-white ring-2 ring-violet-400/50 shadow-lg scale-[1.02] sm:scale-105"
            : "border-zinc-200 bg-white shadow-md hover:border-zinc-300"
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute left-0 right-0 top-0 bg-emerald-600 py-1.5 text-center text-xs font-semibold text-white">
          Seu plano
        </div>
      )}
      {showPopular && (
        <div className="absolute left-0 right-0 top-0 bg-violet-500 py-1.5 text-center text-xs font-semibold text-white">
          Mais popular
        </div>
      )}
      <CardHeader className={`space-y-2 ${isCurrentPlan || isPopular ? "pt-10" : ""}`}>
        <CardTitle className="text-xl font-bold text-zinc-900">
          {plan.name}
        </CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-zinc-900">
            {formatPriceFn(plan.amount)}
          </span>
          <span className="text-zinc-500">/{intervalLabel}</span>
        </div>
        <CardDescription className="text-zinc-600">
          Tudo que você precisa para criar e organizar mapas sem limite.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ul className="space-y-3 text-sm text-zinc-700">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        {isCurrentPlan ? (
          <Button size="lg" variant="outline" className="w-full gap-2 font-semibold" asChild>
            <Link to="/subscription" className="flex h-10 w-full items-center justify-center gap-2">
              Gerenciar assinatura
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              className={`w-full gap-2 font-semibold ${
                isPopular
                  ? "bg-violet-600 shadow-md hover:bg-violet-700"
                  : ""
              }`}
              disabled={isPending}
              onClick={onSelect}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Começar agora
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
            {isPopular && (
              <p className="text-center text-xs text-zinc-500">
                Cancele quando quiser • Pagamento seguro
              </p>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function FreePlanCard({ isCurrentPlan = true }: { isCurrentPlan?: boolean }) {
  return (
    <Card className="relative flex flex-col overflow-hidden border-zinc-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {isCurrentPlan && (
        <div className="absolute left-0 right-0 top-0 bg-zinc-800 py-1.5 text-center text-xs font-semibold text-white">
          Seu plano atual
        </div>
      )}
      <CardHeader className={`space-y-2 ${isCurrentPlan ? "pt-10" : ""}`}>
        <CardTitle className="text-xl font-bold text-zinc-900">
          {FREE_PLAN.name}
        </CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-zinc-900">
            R$ 0
          </span>
          <span className="text-zinc-500">/sempre</span>
        </div>
        <CardDescription className="text-zinc-600">
          Comece agora com 5 mapas mentais. Sem cartão de crédito.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ul className="space-y-3 text-sm text-zinc-700">
          {FREE_PLAN.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        <Button size="lg" variant="outline" className="w-full gap-2 font-semibold" asChild>
          <Link to="/register" className="flex h-10 w-full items-center justify-center gap-2">
            <UserCheck className="size-4 shrink-0" />
            Começar grátis
          </Link>
        </Button>
        <p className="text-center text-xs text-zinc-500">
          Sem cartão de crédito
        </p>
      </CardFooter>
    </Card>
  );
}

export function PricingPage() {
  const { data: plans, isLoading, isError } = usePlans();
  const { data: subscription } = useCurrentSubscription();
  const createCheckout = useCreateCheckoutSession();

  const currentPriceId = subscription?.stripe_price_id ?? null;
  const isFreeCurrentPlan = !currentPriceId;

  if (isLoading) {
    return <PricingPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
          <HelpCircle className="size-8" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900">
          Planos temporariamente indisponíveis
        </h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-600">
          Estamos preparando novidades. Tente novamente em alguns minutos ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  const paidPlans = [...(plans ?? [])].sort((a, b) => a.amount - b.amount);
  const popularIndex =
    paidPlans.length >= 2 ? Math.floor(paidPlans.length / 2) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50/80">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
            <Sparkles className="size-4" />
            Planos que cabem no seu ritmo
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Invista no que{" "}
            <span className="text-violet-600">realmente importa</span>
          </h1>
          <p className="mt-4 text-base font-medium text-zinc-500 sm:text-lg">
            Para criadores, estudantes e equipes que querem organizar ideias e tomar decisões melhores.
          </p>
          <p className="mt-3 text-lg text-zinc-600 sm:text-xl">
            Mapas ilimitados, bibliotecas organizadas e suporte quando precisar.
            Comece em menos de 2 minutos — sem cartão no plano grátis.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-4">
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm font-medium text-zinc-600"
            >
              <Icon className="size-5 text-violet-500" />
              {text}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-6 border-t border-zinc-200/80 pt-10">
          {SOCIAL_PROOF_STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                {value}
              </div>
              <div className="mt-0.5 text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="border-y border-zinc-200/80 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            Quem já usa recomenda
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
            Criadores, estudantes e equipes que já organizam ideias com a Ankorar.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 shadow-sm"
              >
                <Quote className="absolute right-4 top-4 size-8 text-violet-200" />
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-zinc-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-700">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-y border-zinc-200/80 bg-white/60 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            O que você ganha em qualquer plano
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
            Recursos pensados para quem quer criar mais e perder menos tempo.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section
        id="pricing-cards"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
      >
        <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
          Escolha seu plano
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Comece grátis com 5 mapas ou escolha um plano pago para desbloquear tudo.
        </p>
        <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2 font-medium text-violet-700">
            <Users className="size-4" />
            +200 assinaturas nos últimos 30 dias
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-600">Planos pagos: menos que um café por dia</span>
        </div>
        <div className="mx-auto mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {USE_CASES.map((useCase) => (
            <span
              key={useCase}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
            >
              {useCase}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <FreePlanCard isCurrentPlan={isFreeCurrentPlan} />
          {paidPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={index === popularIndex}
              isCurrentPlan={plan.price_id === currentPriceId}
              formatPriceFn={formatPrice}
              onSelect={() => createCheckout.mutate(plan.price_id)}
              isPending={createCheckout.isPending}
            />
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-center shadow-sm">
          <p className="text-sm text-zinc-600">
            <span className="font-semibold text-zinc-800">98% dos usuários</span>
            {" "}recomendariam a Ankorar para organizar mapas e ideias.
          </p>
        </div>
      </section>

      {/* Garantia / Objeções */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/80 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
            <ShieldCheck className="size-7" />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <ShieldCheck className="size-4" />
            Experimente sem risco — cancele em 1 clique
          </div>
          <h2 className="mt-5 text-2xl font-bold text-zinc-900">
            Sem surpresas, sem fidelidade
          </h2>
          <p className="mt-3 text-zinc-600">
            Cancele quando quiser pelo painel da assinatura. Seu acesso continua até o fim do período pago.
            Dúvidas? Nosso suporte responde em português.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-zinc-900">
          Perguntas frequentes
        </h2>
        <ul className="mt-10 space-y-8">
          {FAQ_ITEMS.map(({ pergunta, resposta }) => (
            <li key={pergunta}>
              <h3 className="font-semibold text-zinc-900">{pergunta}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {resposta}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA final */}
      <section className="border-t border-zinc-200/80 bg-gradient-to-br from-violet-600 to-violet-700 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Pronto para criar sem limites?
          </h2>
          <p className="mt-3 text-violet-100">
            Escolha um plano acima e comece em menos de 2 minutos. Sem fidelidade — junte-se a centenas de criadores este mês.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-violet-200">
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
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-violet-700 shadow-lg transition hover:bg-violet-50"
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
