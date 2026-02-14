import { ActivationToken, CreateActivationTokenProps } from "./ActivationToken";
import { persistActivationToken } from "./fns/persistActivationToken";

type CreateActivationTokenInput = CreateActivationTokenProps;

type CreateActivationTokenResponse = {
  activationToken: ActivationToken;
};

export async function createActivationToken(
  props: CreateActivationTokenInput,
): Promise<CreateActivationTokenResponse> {
  const activationToken = ActivationToken.create(props);
  await persistActivationToken({ activationToken });
  return { activationToken };
}
