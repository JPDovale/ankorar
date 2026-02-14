import { ApiKey, CreateApiKeyProps } from "./ApiKey";
import { persistApiKey } from "./fns/persistApiKey";

type CreateApiKeyInput = CreateApiKeyProps;

type CreateApiKeyResponse = {
  apiKey: ApiKey;
};

export async function createApiKey(
  props: CreateApiKeyInput,
): Promise<CreateApiKeyResponse> {
  const apiKey = ApiKey.create(props);

  await persistApiKey({ apiKey });

  return { apiKey };
}
