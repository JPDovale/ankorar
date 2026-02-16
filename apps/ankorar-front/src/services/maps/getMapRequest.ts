import { connection } from "@/services/ankorarApi/axios";

export interface MapDetails {
  id: string;
  title: string;
  content: unknown[];
  created_at: string;
  updated_at: string | null;
  can_edit: boolean;
  likes_count: number;
  liked_by_me: boolean;
}

interface GetMapRequestData {
  map: MapDetails;
}

export async function getMapRequest(props: { mapId: string }) {
  return connection.get<GetMapRequestData>(`/v1/maps/${props.mapId}`);
}
