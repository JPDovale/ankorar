import { AnkorarLogoMark } from "@/components/AnkorarLogoMark";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useUser } from "@/hooks/useUser";
import {
  ArrowRight,
  MapPin,
  Zap,
  Users,
  Sparkles,
  CheckCircle2,
  Star,
  Quote,
} from "lucide-react";

const STATS = [
  { value: "500+", label: "usuários ativos" },
  { value: "12k+", label: "mapas criados" },
  { value: "4,9", label: "avaliação" },
  { value: "98%", label: "recomendariam" },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Mapas que organizam",
    description:
      "Crie mapas mentais ilimitados, conecte ideias e visualize projetos de forma clara.",
  },
  {
    icon: Zap,
    title: "Rápido e intuitivo",
    description:
      "Interface limpa para você criar e editar sem perder tempo. Foco no que importa.",
  },
  {
    icon: Users,
    title: "Bibliotecas e equipes",
    description:
      "Organize em bibliotecas, compartilhe com a equipe e escale sem complicação.",
  },
];

const TESTIMONIALS = [
  {
    name: "Marina C.",
    role: "Product Manager",
    quote: "Organizei todos os projetos em bibliotecas. O tempo que perdia procurando mapa sumiu.",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Ricardo M.",
    role: "Consultor",
    quote: "Uso em mentoria e workshops. Interface limpa, meus clientes adoram os mapas.",
    rating: 5,
    initials: "RM",
  },
];

export function LandingPage() {
  const { user, isLoadingUser } = useUser();

  return (
    <div className="min-h-screen bg-ds-surface">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-navy-200/40 bg-ds-surface-elevated/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex h-10 items-center gap-2 rounded-lg px-1 transition-colors hover:bg-amber-50/50"
          >
            <AnkorarLogoMark className="size-5 shrink-0 text-amber-600" />
            <span className="text-lg font-bold leading-none tracking-tight text-navy-900">
              Anko<span className="text-amber-600">rar</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/pricing">
              <Button variant="ghost" size="sm" className="text-text-secondary">
                Preços
              </Button>
            </Link>
            {!isLoadingUser && user ? (
              <Link to="/home">
                <Button size="sm" className="gap-1.5">
                  Ir para o app
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gap-1.5">
                    Criar conta
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            <Sparkles className="size-4" />
            Mapas mentais que organizam ideias
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Organize ideias.{" "}
            <span className="text-amber-600">Tome decisões melhores.</span>
          </h1>
          <p className="mt-5 text-lg text-text-secondary sm:text-xl">
            Crie mapas mentais, bibliotecas e projetos em um só lugar. Comece
            grátis com 5 mapas — sem cartão de crédito.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-2 font-semibold shadow-md">
                Criar conta grátis
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="gap-2 font-medium">
                Ver planos
              </Button>
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-text-muted">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-ds-success" />
              Sem cartão no início
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-ds-success" />
              5 mapas grátis
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-ds-success" />
              Cancele quando quiser
            </li>
          </ul>
        </div>
        {/* Stats */}
        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-x-12 gap-y-6 border-t border-navy-200/40 pt-12">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-navy-900 sm:text-3xl">
                {value}
              </div>
              <div className="mt-0.5 text-sm text-text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-navy-200/40 bg-ds-surface-elevated py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900 sm:text-3xl">
            Tudo que você precisa para organizar ideias
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
            Ferramentas pensadas para criadores, estudantes e equipes.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-navy-200/50 bg-ds-surface p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-navy-200/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900 sm:text-3xl">
            Quem já usa recomenda
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
            Criadores e equipes que organizam ideias com a Ankorar.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl border border-navy-200/50 bg-ds-surface-elevated p-6 shadow-sm"
              >
                <Quote className="absolute right-4 top-4 size-8 text-amber-100" />
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-navy-800">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-sm font-semibold text-amber-700">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-navy-900">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy-800 to-navy-900 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-ds-white sm:text-3xl">
            Pronto para organizar suas ideias?
          </h2>
          <p className="mt-3 text-navy-300">
            Crie sua conta em menos de 2 minutos. Comece com 5 mapas grátis.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button
                size="lg"
                className="gap-2 font-semibold shadow-lg"
              >
                Criar conta grátis
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 text-ds-white hover:bg-white/10 hover:text-ds-white"
              >
                Ver planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-200/40 bg-ds-surface-elevated py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <AnkorarLogoMark className="size-5 shrink-0 text-amber-600" />
            <span className="font-bold text-navy-900">Anko<span className="text-amber-600">rar</span></span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-text-secondary">
            <Link to="/pricing" className="hover:text-navy-900">
              Preços
            </Link>
            <Link to="/login" className="hover:text-navy-900">
              Entrar
            </Link>
            <Link to="/register" className="hover:text-navy-900">
              Criar conta
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
