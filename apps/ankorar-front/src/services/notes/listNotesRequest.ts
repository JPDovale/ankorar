import { connection } from "@/services/ankorarApi/axios";

export interface NotePreview {
  id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string | null;
  likes_count: number;
}

interface ListNotesRequestData {
  notes: NotePreview[];
}

export async function listNotesRequest() {
  return connection.get<ListNotesRequestData>("/v1/notes");
}
