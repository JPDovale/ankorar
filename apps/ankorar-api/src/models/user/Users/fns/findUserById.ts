import { db } from "@/src/infra/database/pool";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { User } from "../User";

type FindUserByIdInput = {
  id: string;
};

type FindUserByIdResponse = {
  user: User;
};

export async function findUserById({
  id,
}: FindUserByIdInput): Promise<FindUserByIdResponse> {
  const userOnDb = await db.user.findFirst({
    where: {
      id,
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
    },
    userOnDb.id,
  );

  return { user };
}
