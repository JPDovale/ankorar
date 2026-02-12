import { connection } from "@/services/ankorarApi/axios";

export interface MapPreview {
  id: string;
  title: string;
  created_at: string;
  updated_at: string | null;
}

interface ListMapsRequestData {
  maps: MapPreview[];
}

export async function listMapsRequest() {
  return connection.get<ListMapsRequestData>("/v1/maps");
}
