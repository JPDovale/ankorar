import { connection } from "@/services/ankorarApi/axios";

export interface ApiKeyPreview {
  id: string;
  prefix: string;
  env: string;
  features: string[];
  created_at: string;
  last_used_at: string;
  revoked_at: string | null;
  expires_at: string | null;
}

interface ListApiKeysResponseData {
  api_keys: ApiKeyPreview[];
}

export async function listApiKeysRequest() {
  return connection.get<ListApiKeysResponseData>("/v1/organizations/api_keys");
}
