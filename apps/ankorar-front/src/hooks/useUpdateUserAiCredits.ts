import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAiCreditsRequest } from "@/services/users/updateUserAiCreditsRequest";
import { userByIdQueryKey } from "./useUserById";
import { toast } from "sonner";

export function useUpdateUserAiCredits(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      ai_credits: number;
      never_expire?: boolean;
    }) => {
      if (!userId) throw new Error("userId is required");
      const response = await updateUserAiCreditsRequest(userId, body);
      if (response.status !== 204) {
        const err = response.error as { message?: string } | undefined;
        throw new Error(err?.message ?? "Falha ao atualizar créditos de IA.");
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: [...userByIdQueryKey, userId],
        });
      }
      toast.success("Créditos de IA atualizados.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Erro ao atualizar créditos de IA.");
    },
  });
}
