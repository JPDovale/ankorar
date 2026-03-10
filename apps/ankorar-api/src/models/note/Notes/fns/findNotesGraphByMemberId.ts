import { db } from "@/src/infra/database/pool";

interface GraphNode {
  id: string;
  title: string;
}

interface GraphEdge {
  from_note_id: string;
  to_note_id: string;
}

interface NotesGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function findNotesGraphByMemberId({
  memberId,
}: {
  memberId: string;
}): Promise<NotesGraph> {
  const notes = await db.note.findMany({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
    select: {
      id: true,
      title: true,
    },
  });

  const nodeIds = notes.map((n: { id: string; title: string }) => n.id);

  const relations = await db.noteRelation.findMany({
    where: {
      from_note_id: { in: nodeIds },
      to_note_id: { in: nodeIds },
    },
    select: {
      from_note_id: true,
      to_note_id: true,
    },
  });

  return {
    nodes: notes,
    edges: relations,
  };
}
