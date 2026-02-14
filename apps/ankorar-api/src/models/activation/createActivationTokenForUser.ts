import { date } from "../date";
import { User } from "../user/User";
import { ActivationToken } from "./ActivationToken";
import { createActivationToken } from "./createActivationToken";

type CreateActivationTokenForUserInput = {
  user: User;
};

type CreateActivationTokenForUserResponse = {
  activationToken: ActivationToken;
};

export async function createActivationTokenForUser({
  user,
}: CreateActivationTokenForUserInput): Promise<CreateActivationTokenForUserResponse> {
  const expiresAt = date.addMinutes(date.nowUtcDate(), 15);

  const { activationToken } = await createActivationToken({
    expires_at: expiresAt,
    user_id: user.id,
  });

  return { activationToken };
}
