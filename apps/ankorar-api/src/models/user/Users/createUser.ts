import { CreateUserProps, User } from "./User";
import { hashUserPassword } from "./hashUserPassword";
import { validateUserUniqueEmail } from "./validateUserUniqueEmail";
import { persistUser } from "./fns/persistUser";

type CreateUserInput = CreateUserProps;

type CreateUserResponse = {
  user: User;
};

export async function createUser(
  props: CreateUserInput,
): Promise<CreateUserResponse> {
  const user = User.create(props);

  await validateUserUniqueEmail({ user });
  await hashUserPassword({ user });
  await persistUser({ user });

  return { user };
}
