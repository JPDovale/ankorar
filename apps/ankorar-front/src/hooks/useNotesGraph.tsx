import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getNotesGraphRequest,
  type GraphNode,
  type GraphEdge,
} from "@/services/notes/getNotesGraphRequest";

export const notesGraphQueryKey = ["notes", "graph"] as const;

async function notesGraphQueryFn(): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
}> {
  const response = await getNotesGraphRequest();

  if (response.status === 200 && response.data) {
    return {
      edges: response.data.edges ?? [],
      nodes: response.data.nodes ?? [],
    };
  }

  return { nodes: [], edges: [] };
}

function buildNotesGraphQueryConfig() {
  return {
    queryKey: notesGraphQueryKey,
    queryFn: notesGraphQueryFn,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  };
}

export function useSuspenseNotesGraph() {
  return useSuspenseQuery(buildNotesGraphQueryConfig());
}
