import { db } from "@/src/infra/database/pool";
import { User } from "../User";

type PersistUserInput = {
  user: User;
};

type PersistUserResponse = {
  user: User;
};

export async function persistUser({
  user,
}: PersistUserInput): Promise<PersistUserResponse> {
  const data = {
    created_at: user.created_at,
    email: user.email,
    id: user.id,
    name: user.name,
    ext_id: user.ext_id,
    password: user.password,
    deleted_at: user.deleted_at,
    updated_at: user.updated_at,
    stripe_customer_id: user.stripe_customer_id,
    stripe_subscription_id: user.stripe_subscription_id,
    stripe_price_id: user.stripe_price_id,
    subscription_status: user.subscription_status,
  };

  if (user.isNewEntity) {
    await db.user.create({
      data,
    });
  }

  if (user.isUpdatedRecently) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data,
    });
  }

  return { user };
}
