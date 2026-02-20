import { Button } from "@/components/ui/button";
import type { UserListItem } from "@/services/users/listUsersRequest";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { UsersListItem } from "./UsersListItem";

const SUBSCRIPTION_LABEL: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Pendente",
  trialing: "Teste",
};

interface UsersListSectionProps {
  users: UserListItem[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export function UsersListSection({
  users,
  total,
  page,
  totalPages,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onSelectUser,
  isLoading,
  isError,
}: UsersListSectionProps) {
  const empty = users.length === 0 && !isLoading;

  if (isError) {
    return (
      <div
        className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-6 py-8 text-center"
        role="alert"
      >
        <p className="text-sm font-medium text-amber-800">
          Não foi possível carregar os usuários.
        </p>
        <p className="mt-1 text-xs text-amber-700">
          Tente recarregar a página.
        </p>
      </div>
    );
  }

  return (
    <section
      id="users-list"
      aria-labelledby="users-list-title"
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="users-list-title"
          className="text-sm font-semibold text-zinc-900"
        >
          Listagem
        </h2>
        <nav
          className="flex items-center gap-2"
          aria-label="Paginação da listagem de usuários"
        >
          <span className="text-xs text-zinc-500">
            Página {page} de {totalPages}
            {total > 0 && ` · ${total} no total`}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrev || isLoading}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!hasNext || isLoading}
              aria-label="Próxima página"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </nav>
      </div>

      {empty && (
        <div
          className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-12 text-center"
          data-state="empty"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <Users className="size-6 text-zinc-500" />
          </span>
          <p className="mt-4 text-sm font-medium text-zinc-700">
            Nenhum usuário na plataforma
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            A listagem aparecerá aqui quando houver usuários.
          </p>
        </div>
      )}

      {!empty && (
        <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <table
            className="w-full text-sm"
            aria-label="Usuários da plataforma"
          >
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/80">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">
                  Nome
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 sm:table-cell">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">
                  Assinatura
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">
                  <span className="sr-only">Abrir</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <UsersListItem
                  key={user.id}
                  user={user}
                  subscriptionLabel={
                    SUBSCRIPTION_LABEL[user.subscription_status ?? ""] ??
                    user.subscription_status ??
                    "—"
                  }
                  onSelect={() => onSelectUser(user.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
