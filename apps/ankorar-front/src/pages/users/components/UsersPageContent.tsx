import { useUser } from "@/hooks/useUser";
import { Navigate } from "react-router";
import { UsersListSection } from "./UsersListSection";
import { useUsersPage } from "../hooks/useUsersPage";

export function UsersPageContent() {
  const { can } = useUser();
  const {
    users,
    total,
    page,
    totalPages,
    hasNext,
    hasPrev,
    goToNext,
    goToPrev,
    goToUser,
    summaryText,
    isLoading,
    isError,
  } = useUsersPage();

  if (!can("read:user:other")) {
    return <Navigate to="/home" replace />;
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Usuários
        </h1>
        <p className="text-sm text-zinc-500">
          {summaryText}. Status de assinatura por usuário.
        </p>
      </header>

      <UsersListSection
        users={users}
        total={total}
        page={page}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onNext={goToNext}
        onPrev={goToPrev}
        onSelectUser={goToUser}
        isLoading={isLoading}
        isError={isError}
      />
    </section>
  );
}
