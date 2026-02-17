import { connection } from "@/services/ankorarApi/axios";

export interface CurrentSubscription {
  subscription_status: string | null;
  stripe_price_id: string | null;
  current_period_end: string | null;
}

export async function getCurrentSubscriptionRequest() {
  return connection.get<CurrentSubscription | null>(
    "/v1/users/me/subscription",
  );
}
