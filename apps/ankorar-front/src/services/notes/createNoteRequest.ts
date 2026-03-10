import { connection } from "@/services/ankorarApi/axios";

export interface CreateNoteRequestBody {
  title: string;
  text?: string;
}

export async function createNoteRequest(payload: CreateNoteRequestBody) {
  return connection.post<null>("/v1/notes", payload);
}
