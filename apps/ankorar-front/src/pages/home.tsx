import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { ArrowRight, BrainCircuit, ChartNoAxesCombined, Sparkles } from "lucide-react";
import { Link } from "react-router";

const metrics = [
  {
    title: "Mapas criados",
    value: "24",
    description: "Organizados em 7 áreas de estudo",
  },
  {
    title: "Nós ativos",
    value: "1.328",
    description: "Atualizados nos últimos 30 dias",
  },
  {
    title: "Sessões concluídas",
    value: "89",
    description: "Aprendizados marcados como revisados",
  },
];

export function HomePage() {
  const { user } = useUser();

  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden border-zinc-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%)]"
        />
        <CardHeader className="relative pb-2">
          <Badge variant="secondary" className="mb-3 w-fit">
            <Sparkles className="mr-1 size-3" />
            Home
          </Badge>
          <CardTitle className="text-2xl">Olá, {user?.name ?? "usuário"}.</CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-relaxed">
            Esta é sua área inicial logada. A partir daqui você acessa o editor
            de mapas mentais, acompanha métricas e organiza o trabalho por
            organização.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex flex-wrap gap-3 pt-4">
          <Link
            to="/mind-map"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <BrainCircuit className="size-4" />
            Abrir editor
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/home"
            className={buttonVariants({ variant: "outline" })}
            aria-current="page"
          >
            Atualizar visão geral
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartNoAxesCombined className="size-5" />
            Próximos passos
          </CardTitle>
          <CardDescription>
            Conecte os dados de mapas mentais para transformar essa área em um
            dashboard 100% dinâmico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600">
          <p>1. Expor endpoint de listagem de organizações na API.</p>
          <p>2. Persistir organização selecionada por usuário.</p>
          <p>3. Alimentar os cards com dados reais do workspace.</p>
        </CardContent>
      </Card>
    </section>
  );
}
