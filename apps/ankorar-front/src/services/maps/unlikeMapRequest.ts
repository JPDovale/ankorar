import { connection } from "@/services/ankorarApi/axios";

export async function unlikeMapRequest(props: { mapId: string }) {
  return connection.delete(`/v1/maps/${props.mapId}/like`);
}
