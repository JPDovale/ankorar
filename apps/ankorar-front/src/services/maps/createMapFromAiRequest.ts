import { connection } from "@/services/ankorarApi/axios";

export interface CreateMapFromAiRequestBody {
  description: string;
  title?: string;
}

export interface CreateMapFromAiResponseData {
  map_id: string;
}

export async function createMapFromAiRequest(
  payload: CreateMapFromAiRequestBody,
) {
  return connection.post<CreateMapFromAiResponseData>(
    "/v1/maps/from-ai",
    payload,
  );
}
