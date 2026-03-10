import { extractNoteLinkIds } from "./fns/extractNoteLinkIds";
import { findNoteByIdAndMemberId } from "./fns/findNoteByIdAndMemberId";
import { persistNote } from "./fns/persistNote";
import { syncNoteRelations } from "./fns/syncNoteRelations";

type UpdateNoteInput = {
  id: string;
  memberId: string;
  title?: string;
  text?: string;
};

type UpdateNoteResponse = {
  note: Awaited<ReturnType<typeof findNoteByIdAndMemberId>>["note"];
};

export async function updateNote({
  id,
  memberId,
  title,
  text,
}: UpdateNoteInput): Promise<UpdateNoteResponse> {
  const { note } = await findNoteByIdAndMemberId({ id, memberId });

  if (title !== undefined) note.title = title;
  if (text !== undefined) note.text = text;

  await persistNote({ note });

  const contentToParse = text !== undefined ? text : note.text;
  const extractedIds = extractNoteLinkIds(contentToParse);
  await syncNoteRelations({
    fromNoteId: id,
    memberId,
    extractedNoteIds: extractedIds,
  });

  return { note };
}
