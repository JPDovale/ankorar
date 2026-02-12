import { connection } from "@/services/ankorarApi/axios";

export interface CreateLibraryRequestBody {
  name: string;
}

export async function createLibraryRequest(payload: CreateLibraryRequestBody) {
  return connection.post<null>("/v1/libraries", payload);
}
