import { connection } from "@/services/ankorarApi/axios";

export async function revokeApiKeyRequest(apiKeyId: string) {
  return connection.post<null>(
    `/v1/organizations/api_keys/${apiKeyId}/revoke`,
  );
}
