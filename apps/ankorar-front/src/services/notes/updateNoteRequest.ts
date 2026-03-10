import { connection } from "@/services/ankorarApi/axios";

export interface UpdateNoteRequestBody {
  title?: string;
  text?: string;
}

export async function updateNoteRequest(
  noteId: string,
  payload: UpdateNoteRequestBody,
) {
  return connection.patch<null>(`/v1/notes/${noteId}`, payload);
}
