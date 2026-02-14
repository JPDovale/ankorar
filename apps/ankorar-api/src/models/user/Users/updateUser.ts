import { User } from "./User";
import { hashUserPassword } from "./hashUserPassword";
import { validateUserUniqueEmail } from "./validateUserUniqueEmail";
import { findUserById } from "./fns/findUserById";
import { persistUser } from "./fns/persistUser";

type UpdateUserInput = {
  id: string;
  name?: string;
  email?: string;
  password?: string | null;
};

type UpdateUserResponse = {
  user: User;
};

export async function updateUser({
  id,
  name,
  email,
  password,
}: UpdateUserInput): Promise<UpdateUserResponse> {
  const { user } = await findUserById({ id });

  user.name = name;
  user.password = password;
  user.email = email;

  await validateUserUniqueEmail({ user });
  await hashUserPassword({ user });
  await persistUser({ user });

  return { user };
}
