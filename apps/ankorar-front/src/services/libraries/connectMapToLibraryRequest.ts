import { connection } from "@/services/ankorarApi/axios";

interface ConnectMapToLibraryRequestProps {
  mapId: string;
  libraryId: string;
}

export async function connectMapToLibraryRequest({
  mapId,
  libraryId,
}: ConnectMapToLibraryRequestProps) {
  return connection.post<null>(
    `/v1/libraries/${libraryId}/maps/${mapId}/connect`,
  );
}
