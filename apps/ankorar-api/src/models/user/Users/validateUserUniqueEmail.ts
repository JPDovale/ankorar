import { UserAlreadyExists } from "@/src/infra/errors/UserAlreadyExists";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { safeCall } from "@/src/utils/safeCall";
import { User } from "./User";
import { findUserByEmail } from "./fns/findUserByEmail";

type ValidateUserUniqueEmailInput = {
  user: User;
};

type ValidateUserUniqueEmailResponse = {
  user: User;
};

export async function validateUserUniqueEmail({
  user,
}: ValidateUserUniqueEmailInput): Promise<ValidateUserUniqueEmailResponse> {
  const userExistsResult = await safeCall(() =>
    findUserByEmail({
      email: user.email,
    }),
  );

  if (!userExistsResult.success && !(userExistsResult.error instanceof UserNotFound)) {
    throw userExistsResult.error;
  }

  if (userExistsResult.success && userExistsResult.data.user.id !== user.id) {
    throw new UserAlreadyExists();
  }

  return { user };
}
