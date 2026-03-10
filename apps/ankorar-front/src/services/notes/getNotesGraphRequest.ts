import { connection } from "../ankorarApi/axios";

export interface GraphNode {
  id: string;
  title: string;
}

export interface GraphEdge {
  from_note_id: string;
  to_note_id: string;
}

interface GetNotesGraphResponse {
  status: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function getNotesGraphRequest() {
  return await connection.get<GetNotesGraphResponse>("/v1/notes/graph");
}
