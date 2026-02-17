import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { Mail, User } from "lucide-react";

export function UserSettingsPage() {
  const { user } = useUser();
  const userName = user?.name ?? "—";
  const userEmail = user?.email ?? "—";

  return (
    <section className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Minha conta
        </h1>
        <p className="text-sm text-zinc-500">
          Dados do seu perfil. Entre em contato com o suporte para alterar nome ou e-mail.
        </p>
      </header>

      <Card className="border-zinc-200/80">
        <CardHeader>
          <CardTitle className="text-lg">Perfil</CardTitle>
          <CardDescription>
            Informações da sua conta na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-4 py-3">
            <User className="size-5 shrink-0 text-zinc-500" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-500">Nome</p>
              <p className="truncate text-sm font-medium text-zinc-900">
                {userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-4 py-3">
            <Mail className="size-5 shrink-0 text-zinc-500" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-500">E-mail</p>
              <p className="truncate text-sm font-medium text-zinc-900">
                {userEmail}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
