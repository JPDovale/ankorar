import { connection } from "@/services/ankorarApi/axios";

interface DeleteMapRequestProps {
  mapId: string;
}

export async function deleteMapRequest({ mapId }: DeleteMapRequestProps) {
  return connection.delete<null>(`/v1/maps/${mapId}`);
}
