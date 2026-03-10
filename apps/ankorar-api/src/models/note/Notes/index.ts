import { createNote } from "./createNote";
import { updateNote } from "./updateNote";
import { findNoteByIdAndMemberId } from "./fns/findNoteByIdAndMemberId";
import { findNoteDetailsByIdAndMemberId } from "./fns/findNoteDetailsByIdAndMemberId";
import { findNotePreviewsByMemberId } from "./fns/findNotePreviewsByMemberId";
import { findNotesGraphByMemberId } from "./fns/findNotesGraphByMemberId";
import { persistNote } from "./fns/persistNote";

const Notes = {
  create: createNote,
  update: updateNote,
  fns: {
    findByIdAndMemberId: findNoteByIdAndMemberId,
    findDetailsByIdAndMemberId: findNoteDetailsByIdAndMemberId,
    findPreviewsByMemberId: findNotePreviewsByMemberId,
    findNotesGraphByMemberId: findNotesGraphByMemberId,
    persist: persistNote,
  },
};

export { Notes };
