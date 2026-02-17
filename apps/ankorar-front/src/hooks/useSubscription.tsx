import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createCheckoutSessionRequest } from "@/services/subscription/createCheckoutSessionRequest";
import { createCustomerPortalSessionRequest } from "@/services/subscription/createCustomerPortalSessionRequest";
import {
  getCurrentSubscriptionRequest,
  type CurrentSubscription,
} from "@/services/subscription/getCurrentSubscriptionRequest";
import {
  listPlansRequest,
  type Plan,
} from "@/services/subscription/listPlansRequest";
import { toast } from "sonner";

export const plansQueryKey = ["plans"] as const;
export const currentSubscriptionQueryKey = ["currentSubscription"] as const;

async function listPlansQueryFn(): Promise<Plan[]> {
  const response = await listPlansRequest();
  const data = response.data as { plans?: Plan[] } | undefined;

  if (response.status === 200 && data?.plans) {
    return data.plans;
  }

  return [];
}

async function getCurrentSubscriptionQueryFn(): Promise<CurrentSubscription | null> {
  const response = await getCurrentSubscriptionRequest();

  if (response.status !== 200) {
    return null;
  }

  const d = response.data as CurrentSubscription | undefined | null;
  if (d && typeof d === "object" && ("subscription_status" in d || "stripe_price_id" in d)) {
    return d as CurrentSubscription;
  }

  return null;
}

export function usePlans() {
  return useQuery({
    queryKey: plansQueryKey,
    queryFn: listPlansQueryFn,
    refetchOnWindowFocus: false,
  });
}

export function usePlansSuspense() {
  return useSuspenseQuery({
    queryKey: plansQueryKey,
    queryFn: listPlansQueryFn,
  });
}

export function useCurrentSubscription() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: currentSubscriptionQueryKey,
    queryFn: getCurrentSubscriptionQueryFn,
    refetchOnWindowFocus: false,
  });

  const refetchSubscription = () => {
    return queryClient.invalidateQueries({ queryKey: currentSubscriptionQueryKey });
  };

  return {
    ...query,
    refetchSubscription,
  };
}

export function useCurrentSubscriptionSuspense() {
  return useSuspenseQuery({
    queryKey: currentSubscriptionQueryKey,
    queryFn: getCurrentSubscriptionQueryFn,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (priceId: string) => {
      const response = await createCheckoutSessionRequest({ price_id: priceId });

      if (response.status === 200 && response.data?.url) {
        window.location.href = response.data.url;
        return { success: true };
      }

      toast.error(
        response.error?.message ?? "Não foi possível iniciar o checkout.",
      );
      return { success: false };
    },
  });
}

export function useCreateCustomerPortalSession() {
  return useMutation({
    mutationFn: async () => {
      const response = await createCustomerPortalSessionRequest();

      if (response.status === 200 && response.data?.url) {
        window.location.href = response.data.url;
        return { success: true };
      }

      toast.error(
        response.error?.message ??
          "Não foi possível abrir o gerenciador de assinatura.",
      );
      return { success: false };
    },
  });
}
