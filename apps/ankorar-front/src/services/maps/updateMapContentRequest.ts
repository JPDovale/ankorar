import { connection } from "@/services/ankorarApi/axios";

export interface UpdateMapContentRequestBody {
  mapId: string;
  content: unknown[];
}

export async function updateMapContentRequest(
  payload: UpdateMapContentRequestBody,
) {
  return connection.put<null>(`/v1/maps/${payload.mapId}/content`, {
    content: payload.content,
  });
}
