import { connection } from "@/services/ankorarApi/axios";

interface CreateApiKeyResponseData {
  api_key: string;
}

export async function createApiKeyRequest() {
  return connection.post<CreateApiKeyResponseData>(
    "/v1/organizations/api_keys",
  );
}
