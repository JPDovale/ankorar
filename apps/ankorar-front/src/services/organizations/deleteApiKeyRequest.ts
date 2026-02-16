import { connection } from "@/services/ankorarApi/axios";

export async function deleteApiKeyRequest(apiKeyId: string) {
  return connection.delete<null>(
    `/v1/organizations/api_keys/${apiKeyId}`,
  );
}
