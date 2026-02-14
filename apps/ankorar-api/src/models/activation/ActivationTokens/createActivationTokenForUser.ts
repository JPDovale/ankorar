import { dateModule } from "../../date/DateModule";
import { User } from "../../user/Users/User";
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
  const expiresAt = dateModule.Date.addMinutes(dateModule.Date.nowUtcDate(), 15);

  const { activationToken } = await createActivationToken({
    expires_at: expiresAt,
    user_id: user.id,
  });

  return { activationToken };
}
