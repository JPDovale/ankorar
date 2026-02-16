import { connection } from "@/services/ankorarApi/axios";

export async function likeMapRequest(props: { mapId: string }) {
  return connection.post(`/v1/maps/${props.mapId}/like`);
}
