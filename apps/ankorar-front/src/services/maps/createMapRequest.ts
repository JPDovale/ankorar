import { connection } from "@/services/ankorarApi/axios";

export interface CreateMapRequestBody {
  title: string;
}

export async function createMapRequest(payload: CreateMapRequestBody) {
  return connection.post<null>("/v1/maps", payload);
}
