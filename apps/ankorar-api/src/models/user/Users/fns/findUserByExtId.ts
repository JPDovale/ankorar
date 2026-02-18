import { db } from "@/src/infra/database/pool";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { User } from "../User";

type FindUserByExtIdInput = {
  id: string;
};

type FindUserByExtIdResponse = {
  user: User;
};

export async function findUserByExtId({
  id,
}: FindUserByExtIdInput): Promise<FindUserByExtIdResponse> {
  const userOnDb = await db.user.findFirst({
    where: {
      ext_id: id,
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
      deleted_at: userOnDb.deleted_at,
      ext_id: userOnDb.ext_id,
      password: userOnDb.password,
      created_at: userOnDb.created_at,
      updated_at: userOnDb.updated_at,
      stripe_customer_id: userOnDb.stripe_customer_id,
      stripe_subscription_id: userOnDb.stripe_subscription_id,
      stripe_price_id: userOnDb.stripe_price_id,
      subscription_status: userOnDb.subscription_status,
      ai_credits: userOnDb.ai_credits,
      ai_credits_reset_at: userOnDb.ai_credits_reset_at,
    },
    userOnDb.id,
  );

  return { user };
}
