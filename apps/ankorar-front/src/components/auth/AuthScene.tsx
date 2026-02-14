import { Skeleton } from "@/components/ui/skeleton";
import { Link2, ShieldCheck, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { Suspense, type ReactNode } from "react";

type AuthTone = "cyan" | "violet";

interface AuthHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthSceneProps {
  children: ReactNode;
  subtitle?: string;
  tone?: AuthTone;
  panelEyebrow?: string;
  panelTitle?: string;
  panelDescription?: string;
}

const highlights: AuthHighlight[] = [
  {
    icon: Sparkles,
    title: "Fluxo direto",
    description: "Entre e retome seus mapas sem etapas extras.",
  },
  {
    icon: Workflow,
    title: "Organizacao visual",
    description: "Conecte ideias com estrutura clara e navegacao rapida.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso seguro",
    description: "Sessao protegida para manter seu conteudo consistente.",
  },
] as const;

export function AuthScene({
  children,
  subtitle = "Sua mente organiza, ancora e aprende",
  tone = "cyan",
  panelEyebrow = "Acesso",
  panelTitle = "Continue de onde parou",
  panelDescription = "Entre para acessar seus mapas, bibliotecas e organizacoes.",
}: AuthSceneProps) {
  return (
    <main
      data-tone={tone}
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0f2fe_0%,#f8fafc_42%,#ecfeff_100%)] data-[tone=violet]:bg-[radial-gradient(circle_at_top_left,#ede9fe_0%,#f8fafc_42%,#f5f3ff_100%)] dark:bg-zinc-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-tone={tone}
          className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl data-[tone=violet]:bg-violet-200/60 dark:bg-cyan-800/30 dark:data-[tone=violet]:bg-violet-800/30"
        />
        <div
          data-tone={tone}
          className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl data-[tone=violet]:bg-fuchsia-200/50 dark:bg-emerald-800/20 dark:data-[tone=violet]:bg-fuchsia-800/20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="max-w-xl space-y-8">
            <header className="space-y-4">
              <p className="inline-flex items-center rounded-full border border-zinc-300/70 bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-zinc-600 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
                Plataforma de mapas mentais
              </p>
              <h1 className="flex items-center gap-2 text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  <Link2 className="size-6" />
                </span>
                ANKORAR
              </h1>
              <p className="max-w-lg text-base text-zinc-700 dark:text-zinc-300">
                {subtitle}
              </p>
            </header>

            <ul className="grid gap-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-zinc-200/80 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60"
                  >
                    <span
                      data-tone={tone}
                      className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 data-[tone=violet]:bg-violet-100 data-[tone=violet]:text-violet-700 dark:bg-cyan-900/60 dark:text-cyan-200 dark:data-[tone=violet]:bg-violet-900/60 dark:data-[tone=violet]:text-violet-200"
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="space-y-0.5">
                      <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </span>
                      <span className="block text-sm text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="w-full rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-900/10 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/85 dark:text-zinc-100 sm:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                {panelEyebrow}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {panelTitle}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {panelDescription}
              </p>
            </div>

            <Suspense
              fallback={
                <div className="mt-6 space-y-4" aria-hidden>
                  <Skeleton className="h-4 w-4/5 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="mx-auto h-4 w-2/3 rounded-full" />
                </div>
              }
            >
              {children}
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
