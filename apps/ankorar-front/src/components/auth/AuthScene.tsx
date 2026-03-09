import { AnkorarLogoMark } from "@/components/AnkorarLogoMark";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { Suspense, type ReactNode } from "react";

type AuthTone = "cyan" | "violet" | "amber";

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
  tone = "amber",
  panelEyebrow = "Acesso",
  panelTitle = "Continue de onde parou",
  panelDescription = "Entre para acessar seus mapas, bibliotecas e organizacoes.",
}: AuthSceneProps) {
  return (
    <main
      data-tone={tone}
      className="relative min-h-screen overflow-hidden bg-ds-surface data-[tone=amber]:bg-ds-surface data-[tone=violet]:bg-[radial-gradient(circle_at_top_left,#ede9fe_0%,#f8fafc_42%,#f5f3ff_100%)] data-[tone=cyan]:bg-[radial-gradient(circle_at_top_left,#e0f2fe_0%,#f8fafc_42%,#ecfeff_100%)] dark:bg-navy-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-tone={tone}
          className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl data-[tone=violet]:bg-violet-200/60 data-[tone=cyan]:bg-cyan-200/60 dark:data-[tone=amber]:bg-amber-900/20 dark:data-[tone=violet]:bg-violet-800/30 dark:data-[tone=cyan]:bg-cyan-800/30"
        />
        <div
          data-tone={tone}
          className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl data-[tone=violet]:bg-fuchsia-200/50 data-[tone=cyan]:bg-emerald-200/50 dark:data-[tone=amber]:bg-navy-800/30 dark:data-[tone=violet]:bg-fuchsia-800/20 dark:data-[tone=cyan]:bg-emerald-800/20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,27,42,0.04)_1px,transparent_1px)] bg-[size:80px_80px] data-[tone=violet]:bg-[linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)] data-[tone=cyan]:bg-[linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="max-w-xl space-y-8">
            <header className="space-y-4">
              <p className="inline-flex items-center rounded-full border border-amber-400/25 bg-ds-surface-elevated/90 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-amber-700 backdrop-blur-sm data-[tone=violet]:border-violet-300/70 data-[tone=violet]:bg-white/80 data-[tone=violet]:text-zinc-600 data-[tone=cyan]:border-zinc-300/70 data-[tone=cyan]:bg-white/80 data-[tone=cyan]:text-zinc-600 dark:data-[tone=amber]:border-navy-600 dark:data-[tone=amber]:bg-navy-900/70 dark:data-[tone=amber]:text-amber-300">
                Plataforma de mapas mentais
              </p>
              <h1 className="flex items-center gap-2.5 text-4xl font-black tracking-tight text-navy-900 dark:text-ds-white md:text-5xl data-[tone=violet]:text-zinc-900 data-[tone=cyan]:text-zinc-900">
                <AnkorarLogoMark className="size-11 shrink-0 text-amber-600 dark:text-amber-400 data-[tone=violet]:text-violet-600 data-[tone=cyan]:text-cyan-600" />
                <span className="data-[tone=amber]:font-extrabold data-[tone=violet]:hidden data-[tone=cyan]:hidden">Anko<span className="text-amber-600 dark:text-amber-400">rar</span></span>
                <span className="hidden data-[tone=violet]:inline data-[tone=cyan]:inline">ANKORAR</span>
              </h1>
              <p className="max-w-lg text-base text-text-secondary dark:text-navy-300 data-[tone=violet]:text-zinc-700 data-[tone=cyan]:text-zinc-700">
                {subtitle}
              </p>
            </header>

            <ul className="grid gap-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-navy-200/50 bg-ds-surface-elevated/90 px-4 py-3 backdrop-blur-sm data-[tone=violet]:border-zinc-200/80 data-[tone=violet]:bg-white/70 data-[tone=cyan]:border-zinc-200/80 data-[tone=cyan]:bg-white/70 dark:data-[tone=amber]:border-navy-700 dark:data-[tone=amber]:bg-navy-900/60"
                  >
                    <span
                      data-tone={tone}
                      className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 data-[tone=violet]:bg-violet-100 data-[tone=violet]:text-violet-700 data-[tone=cyan]:bg-cyan-100 data-[tone=cyan]:text-cyan-700 dark:data-[tone=amber]:bg-amber-400/25 dark:data-[tone=amber]:text-amber-200"
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="space-y-0.5">
                      <span className="block text-sm font-semibold text-navy-900 dark:text-ds-white data-[tone=violet]:text-zinc-900 data-[tone=cyan]:text-zinc-900">
                        {item.title}
                      </span>
                      <span className="block text-sm text-text-secondary dark:text-navy-400 data-[tone=violet]:text-zinc-600 data-[tone=cyan]:text-zinc-600">
                        {item.description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="w-full rounded-2xl border border-navy-200/50 bg-ds-surface-elevated p-6 shadow-xl shadow-navy-900/8 backdrop-blur-sm dark:border-navy-700 dark:bg-navy-900/90 sm:p-8 data-[tone=violet]:border-zinc-200/80 data-[tone=violet]:bg-white/90 data-[tone=violet]:shadow-zinc-900/10 data-[tone=cyan]:border-zinc-200/80 data-[tone=cyan]:bg-white/90 data-[tone=cyan]:shadow-zinc-900/10">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.12em] text-amber-600 uppercase dark:text-amber-400 data-[tone=violet]:text-zinc-500 data-[tone=cyan]:text-zinc-500">
                {panelEyebrow}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-ds-white data-[tone=violet]:text-zinc-900 data-[tone=cyan]:text-zinc-900">
                {panelTitle}
              </h2>
              <p className="text-sm text-text-secondary dark:text-navy-400 data-[tone=violet]:text-zinc-600 data-[tone=cyan]:text-zinc-600">
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
