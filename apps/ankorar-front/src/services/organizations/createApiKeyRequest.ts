import { connection } from "@/services/ankorarApi/axios";

interface CreateApiKeyRequestBody {
  expires_at?: string | null;
}

interface CreateApiKeyResponseData {
  api_key: string;
}

export async function createApiKeyRequest(body?: CreateApiKeyRequestBody) {
  return connection.post<CreateApiKeyResponseData>(
    "/v1/organizations/api_keys",
    body ?? {},
  );
}
