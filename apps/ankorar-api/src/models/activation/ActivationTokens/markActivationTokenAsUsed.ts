import { date } from "../../date";
import { ActivationToken } from "./ActivationToken";
import { persistActivationToken } from "./fns/persistActivationToken";

type MarkActivationTokenAsUsedInput = {
  activationToken: ActivationToken;
};

type MarkActivationTokenAsUsedResponse = {
  activationToken: ActivationToken;
};

export async function markActivationTokenAsUsed({
  activationToken,
}: MarkActivationTokenAsUsedInput): Promise<MarkActivationTokenAsUsedResponse> {
  activationToken.used_at = date.nowUtcDate();
  await persistActivationToken({ activationToken });

  return { activationToken };
}
