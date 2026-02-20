import { useUser } from "@/hooks/useUser";
import { useUserById } from "@/hooks/useUserById";
import { Navigate, Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
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

export function UserDetailContent() {
  const { can } = useUser();
  const { user_id } = useParams<{ user_id: string }>();
  const { data: user, isLoading, isError } = useUserById(user_id);

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
            <dd className="mt-1">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium data-[subscription=active]:bg-emerald-500/15 data-[subscription=active]:text-emerald-800 data-[subscription=trialing]:bg-violet-500/15 data-[subscription=trialing]:text-violet-800 data-[subscription=past_due]:bg-amber-500/15 data-[subscription=past_due]:text-amber-800 data-[subscription=canceled]:bg-zinc-500/15 data-[subscription=canceled]:text-zinc-700 data-[subscription=none]:bg-zinc-100 data-[subscription=none]:text-zinc-600"
                data-subscription={user.subscription_status ?? "none"}
              >
                {subscriptionLabel}
              </span>
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
            <dd className="mt-1 text-sm text-zinc-900">{user.ai_credits}</dd>
          </div>
          {user.ai_credits_reset_at && (
            <div className="px-6 py-4">
              <dt className="text-xs font-medium text-zinc-500">
                Reset de créditos em
              </dt>
              <dd className="mt-1 text-sm text-zinc-900">
                {formatDate(user.ai_credits_reset_at)}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
