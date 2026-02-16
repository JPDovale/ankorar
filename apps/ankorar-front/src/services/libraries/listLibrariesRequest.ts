import { connection } from "@/services/ankorarApi/axios";

export interface LibraryPreview {
  id: string;
  name: string;
  created_at: string;
  updated_at: string | null;
  maps: LibraryMapPreview[];
}

export interface LibraryMapPreview {
  id: string;
  title: string;
  created_at: string;
  updated_at: string | null;
  likes_count: number;
  liked_by_me: boolean;
  preview?: string | null;
}

interface ListLibrariesRequestData {
  libraries: LibraryPreview[];
}

export async function listLibrariesRequest() {
  return connection.get<ListLibrariesRequestData>("/v1/libraries");
}
