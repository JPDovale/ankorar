import { connection } from "@/services/ankorarApi/axios";

export interface PlanLimits {
  max_maps: number | null;
  max_organizations_join: number;
  max_organizations_create: number;
  max_libraries: number | null;
  ai_credits_per_month: number;
}

export interface CurrentSubscription {
  subscription_status: string | null;
  stripe_price_id: string | null;
  current_period_end: string | null;
  limits: PlanLimits;
  ai_credits: number;
  ai_credits_reset_at: string | null;
}

export async function getCurrentSubscriptionRequest() {
  return connection.get<CurrentSubscription>(
    "/v1/users/me/subscription",
  );
}
