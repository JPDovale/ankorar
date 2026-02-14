import { User } from "./User";
import { persistUser } from "./fns/persistUser";

type DeleteUserInput = {
  user: User;
};

type DeleteUserResponse = {
  user: User;
};

export async function deleteUser({
  user,
}: DeleteUserInput): Promise<DeleteUserResponse> {
  user.markAsDeleted();
  await persistUser({ user });
  return { user };
}
