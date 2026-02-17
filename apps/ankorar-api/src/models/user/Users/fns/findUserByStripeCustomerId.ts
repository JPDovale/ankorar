import { db } from "@/src/infra/database/pool";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { User } from "../User";

type FindUserByStripeCustomerIdInput = {
  stripeCustomerId: string;
};

type FindUserByStripeCustomerIdResponse = {
  user: User;
};

export async function findUserByStripeCustomerId({
  stripeCustomerId,
}: FindUserByStripeCustomerIdInput): Promise<FindUserByStripeCustomerIdResponse> {
  const userOnDb = await db.user.findFirst({
    where: {
      stripe_customer_id: stripeCustomerId,
      deleted_at: null,
    },
  });

  if (!userOnDb) {
    throw new UserNotFound();
  }

  const user = User.create(
    {
      email: userOnDb.email,
      name: userOnDb.name,
      password: userOnDb.password,
      deleted_at: userOnDb.deleted_at,
      ext_id: userOnDb.ext_id,
      created_at: userOnDb.created_at,
      updated_at: userOnDb.updated_at,
      stripe_customer_id: userOnDb.stripe_customer_id,
      stripe_subscription_id: userOnDb.stripe_subscription_id,
      stripe_price_id: userOnDb.stripe_price_id,
      subscription_status: userOnDb.subscription_status,
    },
    userOnDb.id,
  );

  return { user };
}
