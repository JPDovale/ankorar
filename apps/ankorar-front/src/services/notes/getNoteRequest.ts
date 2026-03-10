import { connection } from "@/services/ankorarApi/axios";

export interface NoteDetails {
  id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string | null;
  can_edit: boolean;
  likes_count: number;
  liked_by_me: boolean;
}

interface GetNoteRequestData {
  note: NoteDetails;
}

export async function getNoteRequest(noteId: string) {
  return connection.get<GetNoteRequestData>(`/v1/notes/${noteId}`);
}
