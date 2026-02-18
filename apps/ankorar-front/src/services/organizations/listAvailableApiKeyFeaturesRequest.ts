import { connection } from "@/services/ankorarApi/axios";

interface ListAvailableApiKeyFeaturesResponseData {
  features: string[];
}

export async function listAvailableApiKeyFeaturesRequest() {
  return connection.get<ListAvailableApiKeyFeaturesResponseData>(
    "/v1/organizations/api_keys/available_features",
  );
}
