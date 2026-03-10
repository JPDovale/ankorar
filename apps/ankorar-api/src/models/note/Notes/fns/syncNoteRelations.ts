import { db } from "@/src/infra/database/pool";

type SyncNoteRelationsInput = {
  fromNoteId: string;
  memberId: string;
  /** IDs extraídos do texto (ex.: [[id|nome]]) — só criamos vínculo para notas que existem e são do mesmo membro */
  extractedNoteIds: string[];
};

/**
 * Sincroniza NoteRelation com base nos IDs encontrados no conteúdo.
 * - Cria vínculos para IDs válidos (nota existe, mesmo member, não é a própria nota).
 * - Remove vínculos cujo ID não aparece mais no conteúdo.
 */
export async function syncNoteRelations({
  fromNoteId,
  memberId,
  extractedNoteIds,
}: SyncNoteRelationsInput): Promise<void> {
  const uniqueIds = [...new Set(extractedNoteIds)].filter(
    (id) => id && id !== fromNoteId,
  );

  const validNotes = await db.note.findMany({
    where: {
      id: { in: uniqueIds },
      member_id: memberId,
      deleted_at: null,
    },
    select: { id: true },
  });
  const validTargetIds = validNotes.map((n) => n.id);

  if (validTargetIds.length === 0) {
    await db.noteRelation.deleteMany({
      where: { from_note_id: fromNoteId },
    });
    return;
  }

  await db.noteRelation.deleteMany({
    where: {
      from_note_id: fromNoteId,
      to_note_id: { notIn: validTargetIds },
    },
  });

  const current = await db.noteRelation.findMany({
    where: { from_note_id: fromNoteId },
    select: { to_note_id: true },
  });
  const currentToIds = new Set(current.map((r) => r.to_note_id));
  const toCreate = validTargetIds.filter((id) => !currentToIds.has(id));
  if (toCreate.length > 0) {
    await db.noteRelation.createMany({
      data: toCreate.map((to_note_id) => ({
        from_note_id: fromNoteId,
        to_note_id,
      })),
      skipDuplicates: true,
    });
  }
}
