import { connection } from "@/services/ankorarApi/axios";

export interface DeepenMapNodeRequestBody {
  mapId: string;
  node: {
    id: string;
    text: string;
    style?: { color?: string };
  };
  /** Path from root (central) to the node's parent. Each item is the text of a node. */
  contextPath?: string[];
}

export interface DeepenMapNodeResponseData {
  newChildren: unknown[];
}

export async function deepenMapNodeRequest(
  payload: DeepenMapNodeRequestBody,
) {
  return connection.post<DeepenMapNodeResponseData>(
    `/v1/maps/${payload.mapId}/deepen-node`,
    {
      node: payload.node,
      ...(payload.contextPath != null && { contextPath: payload.contextPath }),
    },
  );
}
