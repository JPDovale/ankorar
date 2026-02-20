import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSubscriptionRequest } from "@/services/users/updateUserSubscriptionRequest";
import { userByIdQueryKey } from "./useUserById";
import { toast } from "sonner";

export function useUpdateUserSubscription(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (priceId: string | null) => {
      if (!userId) throw new Error("userId is required");
      const response = await updateUserSubscriptionRequest(userId, {
        price_id: priceId,
      });
      if (response.status !== 204) {
        const err = response.error as { message?: string } | undefined;
        throw new Error(err?.message ?? "Falha ao atualizar assinatura.");
      }
    },
    onSuccess: (_, priceId) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [...userByIdQueryKey, userId] });
      }
      toast.success(
        priceId === null
          ? "Assinatura removida. Usuário no plano grátis."
          : "Assinatura atualizada. Não expira.",
      );
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Erro ao atualizar assinatura.");
    },
  });
}
