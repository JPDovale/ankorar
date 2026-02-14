import { ApiKeyIsExpired } from "@/src/infra/errors/ApiKeyIsExpired";
import { dateModule } from "../../date/DateModule";
import { ApiKey } from "../ApiKey";
import { computeText } from "./fns/computeText";
import { findApiKeyByPrefix } from "./fns/findApiKeyByPrefix";
import { hashSecret } from "./fns/hashSecret";
import { persistApiKey } from "./fns/persistApiKey";
import { safeEqualText } from "./fns/safeEqualText";

type ValidateApiKeyInput = {
  text: string;
};

type ValidateApiKeyResponse = {
  apiKey: ApiKey;
};

export async function validateApiKey({
  text,
}: ValidateApiKeyInput): Promise<ValidateApiKeyResponse> {
  const { prefix, secret } = computeText({ text });
  const { apiKey } = await findApiKeyByPrefix({ prefix });

  if (apiKey.revoked_at !== null) {
    throw new ApiKeyIsExpired();
  }

  if (apiKey.expires_at && apiKey.expires_at < dateModule.Date.nowUtcDate()) {
    throw new ApiKeyIsExpired();
  }

  const hashedSecret = hashSecret({ secret });
  safeEqualText(hashedSecret, apiKey.secret);

  apiKey.last_used_at = dateModule.Date.nowUtcDate();

  await persistApiKey({ apiKey });

  return { apiKey };
}
