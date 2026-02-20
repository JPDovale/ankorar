import { useNavigate } from "react-router";
import { useListUsers } from "@/hooks/useListUsers";
import { useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 20;

export function useUsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isError } = useListUsers({
    limit: PAGE_SIZE,
    offset,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const goToNext = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToUser = useCallback(
    (userId: string) => {
      navigate(`/users/${userId}`);
    },
    [navigate],
  );

  const summaryText = useMemo(() => {
    if (total === 0) return "Nenhum usuário";
    if (total === 1) return "1 usuário";
    return `${total} usuários`;
  }, [total]);

  return {
    users,
    total,
    page,
    totalPages,
    pageSize: PAGE_SIZE,
    hasNext,
    hasPrev,
    goToNext,
    goToPrev,
    goToUser,
    summaryText,
    isLoading,
    isError,
  };
}
