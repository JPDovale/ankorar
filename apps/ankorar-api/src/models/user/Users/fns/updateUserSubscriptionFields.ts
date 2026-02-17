import { db } from "@/src/infra/database/pool";
import { dateModule } from "@/src/models/date/DateModule";

type UpdateUserSubscriptionFieldsInput = {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  subscriptionStatus?: string | null;
};

type UpdateUserSubscriptionFieldsResponse = void;

export async function updateUserSubscriptionFields({
  userId,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
  subscriptionStatus,
}: UpdateUserSubscriptionFieldsInput): Promise<UpdateUserSubscriptionFieldsResponse> {
  const data: Record<string, unknown> = {
    updated_at: dateModule.Date.nowUtcDate(),
  };

  if (stripeCustomerId !== undefined) {
    data.stripe_customer_id = stripeCustomerId;
  }
  if (stripeSubscriptionId !== undefined) {
    data.stripe_subscription_id = stripeSubscriptionId;
  }
  if (stripePriceId !== undefined) {
    data.stripe_price_id = stripePriceId;
  }
  if (subscriptionStatus !== undefined) {
    data.subscription_status = subscriptionStatus;
  }

  await db.user.update({
    where: { id: userId },
    data,
  });
}
